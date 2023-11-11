import { getServerSession } from 'next-auth'
import { authOptions } from '../pages/api/auth/[...nextauth]'

export const getSession = async (): Promise<any> => {
  return await getServerSession(authOptions)
}

export const getCurrentUser = async (): Promise<any> => {
  try {
    const session = await getSession()
    const invalidEmail = session?.user?.email === null
    if (invalidEmail) {
      return null
    }

    const currentUser = await prisma?.user.findUnique({
      where: {
        email: session?.user?.email
      }
    })

    if (currentUser === null || currentUser === undefined) {
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
