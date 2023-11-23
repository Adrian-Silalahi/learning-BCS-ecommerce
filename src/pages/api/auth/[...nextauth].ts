import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcrypt'
import NextAuth, { type AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import prisma from '../../../libs/prismadb'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'email',
          placeholder: 'email', 
          type: 'email'
        },
        password: {
          label: 'email',
          type: 'password'
        }
      },

      async authorize (credentials) {
        const invalidEmail = !credentials?.email
        const invalidPassword = !credentials?.password
        if (invalidEmail || invalidPassword) {
          throw new Error('Invalid email or password')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (user?.hashedPassword == null) {
          throw new Error('Invalid email or password')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid email or password')
        }

        return user
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)
