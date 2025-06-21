import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import prisma from '@/database'
import { exclude } from '@/utils'
import { SHA256 as sha256 } from 'crypto-js'

const client = new PrismaClient()

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
          console.log(e)
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  adapter: PrismaAdapter(client),
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
        // Create a cart for new Google users if they don't have one
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { cart: true }
        });

        if (!existingUser) {
          const cart = await prisma.cart.create({});
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              cartId: cart.id,
              emailVerified: new Date(),
            }
          });
        }
      }
      return true;
    },
    async session({ session, token, user }) {
      session.user.id = token.user_id
      session.user.isAdmin = token.isAdmin
      return await session
    },

    async jwt({ token, user }) {
      if (user) {
        token.user_id = user.id
        token.isAdmin = user.isAdmin
      }
      return await token
    },
  },
}

const nextAuth = NextAuth(authOptions)

export { nextAuth as GET, nextAuth as POST }
