import { getCurrentUser } from '@/src/actions/getCurrentUser'
import prisma from '@/src/libs/prismadb'
import { type ProductType } from '@/src/types'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16'
})

const getTotalPrice = (products: ProductType[]): number => {
  const totalPriceAllProducts = products?.reduce((acc, product) => {
    const totalPriceProduct = product.price * product.quantity
    return acc + totalPriceProduct
  }, 0)

  const endPrice: any = Math.floor(totalPriceAllProducts)
  return endPrice
}

export async function POST (request: Request): Promise<NextResponse> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  
  const { cartProducts } = body
  const paymentIntentId = currentUser?.paymentIntentId
  const total = getTotalPrice(cartProducts)
  const stripeTotal = getTotalPrice(cartProducts) * 100
  const orderData = {
    userId: currentUser?.id,
    amount: total,
    currency: 'usd',
    status: 'pending',
    deliveryStatus: 'pending',
    paymentIntentId,
    products: cartProducts
  }

  if (paymentIntentId) {

    const currentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    )

    if (currentIntent) {
      const updatedIntent = await stripe.paymentIntents.update(
        paymentIntentId,
        { amount: stripeTotal }
      )

    const existingOrder = await prisma.order.findFirst({
          where: { paymentIntentId: paymentIntentId },
    })

    const updatedOrder = await prisma.order.update({
          where: { paymentIntentId: paymentIntentId },
          data: {
            amount: total,
            products: cartProducts
          }
    })

    if (!existingOrder) {
        return NextResponse.json(
          { error: 'Invalid Payment Intent' },
          { status: 404 })
      }

    return NextResponse.json({ paymentIntent: updatedIntent })
    }
  }else{

  const paymentIntent = await stripe.paymentIntents.create({
    amount: stripeTotal,
    currency: 'idr',
    automatic_payment_methods: { enabled: true } 
  })

  // create the order
  orderData.paymentIntentId = paymentIntent.id
  await prisma.user.update({
    where: {
      id: currentUser.id
    },
    data: {
      paymentIntentId: paymentIntent.id
    }
  })
  
  await prisma.order.create({
    data: orderData
  })

  return NextResponse.json({ paymentIntent })
}
  return NextResponse.json({ error: 'Error' }, { status: 404 })
}
