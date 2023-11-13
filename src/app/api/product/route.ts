import { getCurrentUser } from '@/src/actions/getCurrentUser'
import prisma from '@/src/libs/prismadb'
import { NextResponse } from 'next/server'

// Membuat sebuah fungsi untuk create akun user
export async function POST (request: Request): Promise<NextResponse> {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { name, description, price, brand, category, inStock, imageInfo } = body

  const product = await prisma.product.create({
    data: {
      name,
      description,
      brand,
      category,
      inStock,
      imageInfo,
      price: parseFloat(price)
    }
  })

  // Mengembalikan data user yang telah ditambahkan ke dalam database
  return NextResponse.json(product)
}

export async function PUT (request: Request): Promise<NextResponse> {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (currentUser === null || currentUser === undefined || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return NextResponse.json({ Error: 'User is not valid!' }, { status: 401 })
  }

  const body = await request.json()
  const { id, inStock } = body

  const product = await prisma.product.update({
    where: {
      id
    },
    data: {
      inStock
    }
  })
  return NextResponse.json(product)
}
