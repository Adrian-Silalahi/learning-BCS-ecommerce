import { getCurrentUser } from '@/src/actions/getCurrentUser'
import prisma from '@/src/libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST (request: Request) {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try{
  const body = await request.json()
  const { id, name, description, category, brand, imageInfo, quantity, price} = body
  let cartProductData ;

  cartProductData = {
    id,
    userId: currentUser.id,
    name,
    description,
    category,
    brand,
    imageInfo,
    quantity,
    price
  }

  const CartProduct = await prisma.cartProduct.create({
    data: cartProductData
  })

  // Mengembalikan data user yang telah ditambahkan ke dalam database
  return NextResponse.json(CartProduct)
  }
  catch(error: any){
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function GET () {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try{
    const CartProduct = await prisma.cartProduct.findMany({
      where: {
        userId: currentUser.id
      }
    })
  
    return NextResponse.json(CartProduct)
  }
  catch(error: any){
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function DELETE () {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try{
    const CartProduct = await prisma.cartProduct.deleteMany({
      where: {
        userId: currentUser.id
      }
    })
  
    return NextResponse.json(CartProduct)
  }
  catch(error: any){
    return NextResponse.json({ error }, { status: 500 })
  }
}