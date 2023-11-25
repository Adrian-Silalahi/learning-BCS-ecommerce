import { getServerSession } from 'next-auth'
import prisma from '../libs/prismadb'
import { authOptions } from '../pages/api/auth/[...nextauth]'

export const getSession = async (): Promise<any> => {
  return await getServerSession(authOptions)
}

export const getCurrentUser = async (): Promise<any> => {
  try {
    const session = await getSession()
    const invalidEmail = !session?.user?.email
    if (invalidEmail) {
      return null
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email
      },
      include: {
        orders: true
      }
    })

    if (!currentUser) {
      return null
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() ?? null
    }
  } catch (error: any) {
    return null
  }
}
