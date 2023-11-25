import { getCurrentUser } from '@/src/actions/getCurrentUser'
import prisma from '@/src/libs/prismadb'
import { type CartProductType, type Order, type Review } from '@prisma/client'
import { NextResponse } from 'next/server'


export async function POST (request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { comment, rating, product, userId } = body

  const deliveredOrder = currentUser?.orders.some((order: Order) => order.products.find((item: CartProductType) => item.productId === product.id) && order.deliveryStatus === 'delivered')

  const userReview = product?.reviews?.find(((review: Review) => { return review.userId === currentUser.id }))

  if (userReview || !deliveredOrder) {
    return NextResponse.error()
  }

  const review = await prisma.review.create({
    data: {
      comment,
      rating,
      productId: product.id,
      userId
    }
  })

  return NextResponse.json(review)
}
