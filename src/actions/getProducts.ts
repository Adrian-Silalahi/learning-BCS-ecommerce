import { type Product } from '@prisma/client'
import prisma from '../libs/prismadb'
import { ProductFilterParams } from '../types'


export default async function getProducts (params: ProductFilterParams): Promise<Product[]> {
  try {
    const { category } = params
    const query: any = {}

    if (category) {
      query.category = category
    }

    let products: Product[]

    products = await prisma.product.findMany({
      where: {
        ...query,
      },
      include: {
        reviews: {
          include: {
            user: true
          },
          orderBy: {
            createdDate: 'desc'
          }
        }
      }
    })
    return products
  } catch (error: any) {
    throw new Error(error)
  }
}
