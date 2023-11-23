import { getCurrentUser } from '@/src/actions/getCurrentUser'
import prisma from '@/src/libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST (request: Request): Promise<NextResponse> {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { name, description, price, brand, category, stock, imageInfo } = body

  const product = await prisma.product.create({
    data: {
      name,
      description,
      brand,
      category,
      stock: parseInt(stock),
      imageInfo,
      price: parseFloat(price)
    }
  })

  return NextResponse.json(product)
}
