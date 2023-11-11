import { type User } from '@prisma/client'

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt' | 'emailVerified'> & {
  createdAt: string
  updatedAt: string
  emailVerified: string
}

export interface ImageType {
  color: string
  colorCode: string
  image: File | null
}
