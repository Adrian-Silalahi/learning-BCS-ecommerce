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

export interface ProductFilterParams {
  category?: string | null
}

export interface ProductType {
  id: string
  userId?: string
  name: string
  description: string
  category: string
  brand: string
  imageInfo: ImageInfoType
  quantity: number
  price: number
}

export interface ImageInfoType {
  color: string
  colorCode: string
  image: string
}
