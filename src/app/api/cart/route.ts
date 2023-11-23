import { getCurrentUser } from '@/src/actions/getCurrentUser'
import prisma from '@/src/libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST (request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try{
  const body = await request.json()
  const { id, productId, name, description, category, brand, imageInfo, quantity, price} = body
  let cartProductData = {
    id,
    productId,
    userId: currentUser.id,
    name,
    description,
    category,
    brand,
    imageInfo,
    quantity,
    price
  }

  const cartProduct = await prisma.cartProduct.create({
    data: cartProductData
  })
  return NextResponse.json(cartProduct)
  }
  catch(error: any){
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function GET () {
  const currentUser = await getCurrentUser()
    if(!currentUser){
      return NextResponse.json({ error: 'Please login first' }, { status: 401 })
    }
    try{
      const cartProduct = await prisma.cartProduct.findMany({
        where: {
          userId: currentUser.id
        }
      })
    
      return NextResponse.json(cartProduct)
    }
    catch(error: any){
      return NextResponse.json({ error }, { status: 500 })
    }
  
}

export async function DELETE () {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try{
    const cartProduct = await prisma.cartProduct.deleteMany({
      where: {
        userId: currentUser.id
      }
    })
  
    return NextResponse.json(cartProduct)
  }
  catch(error: any){
    return NextResponse.json({ error }, { status: 500 })
  }
}