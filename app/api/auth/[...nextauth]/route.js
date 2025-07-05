import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import prisma from '@/database'
import { exclude } from '@/utils'
import { SHA256 as sha256 } from 'crypto-js'

export const hashPassword = (string) => {
  return sha256(string).toString()
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      async authorize(credentials) {
        const { email, password } = credentials
        try {
          const user = await prisma.user.findUnique({
            where: { email: email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              isAdmin: true,
            },
          })

          if (user && user.password && user.password === hashPassword(password)) {
            return exclude(user, ['password'])
          } else {
            return null
          }
        } catch (e) {
          console.error('Error in credentials authorization:', e)
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30,
    encryption: true,
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });

          if (existingUser) {
            return true;
          } else {
            // Create user first
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                emailVerified: new Date(),
              }
            });
            
            // Create cart for the user
            const cart = await prisma.cart.create({
              data: {
                userId: newUser.id
              }
            });
            
            return true;
          }
        } catch (error) {
          console.error('Error in Google signIn callback:', error);
          return false;
        }
      }
      
      return true;
    },

    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.user_id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.user_id = user.id;
        token.isAdmin = user.isAdmin;
      }
      
      // For Google OAuth, ensure we use the correct database user ID
      if (account?.provider === 'google' && user) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });
          
          if (existingUser) {
            // Use the database user ID, not the Google OAuth ID
            token.user_id = existingUser.id;
            token.isAdmin = existingUser.isAdmin;
          } else {
            // Create user if it doesn't exist
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                emailVerified: new Date(),
              }
            });
            
            // Create cart for the user
            await prisma.cart.create({
              data: {
                userId: newUser.id
              }
            });
            
            token.user_id = newUser.id;
            token.isAdmin = newUser.isAdmin;
          }
        } catch (error) {
          console.error('Error ensuring user exists in JWT callback:', error);
        }
      }
      
      return token;
    },
  },
}

const nextAuth = NextAuth(authOptions)

export { nextAuth as GET, nextAuth as POST }