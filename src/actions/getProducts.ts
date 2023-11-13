import { type Product } from '@prisma/client'
import prisma from '../libs/prismadb'

export interface IProductParams {
  category?: string | null
  searchTerm?: string | null
}
export default async function getProducts (params: IProductParams): Promise<Product[]> {
  try {
    const { category, searchTerm } = params
    let searchString = searchTerm

    if (searchTerm === null) {
      searchString = ''
    }

    const query: any = {}

    if (category) {
      query.category = category
    }

    let products: Product[]

    products = await prisma.product.findMany({
      where: {
        ...query,
        OR: [
          {
            name: {
              contains: searchString,
              mode: 'insensitive'
            },
            description: {
              contains: searchString,
              mode: 'insensitive'
            }
          }
        ]
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

    const IS_EMPTY_PRODUCT = products.length === 0

    if (IS_EMPTY_PRODUCT) {
      products = await prisma.product.findMany()
    }
    return products
  } catch (error: any) {
    throw new Error(error)
  }
}
