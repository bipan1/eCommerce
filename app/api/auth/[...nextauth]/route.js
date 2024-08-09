import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const client = new PrismaClient()

const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      async authorize(credentials, req) {
        const userCredentials = {
          email: credentials.email,
          password: credentials.password,
        }
        try {
          const res = await axios.post(
            'http://localhost:3000/api/user/auth',
            userCredentials,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )

          if (res) {
            console.log(res)
            const user = res.data
            return user
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
    async session({ session, token, user }) {
      session.user.id = token.user_id
      return await session
    },

    async jwt({ token, user }) {
      if (user) {
        token.user_id = user.id
      }
      return await token
    },
  },
}

const nextAuth = NextAuth(authOptions)

export { nextAuth as GET, nextAuth as POST }
