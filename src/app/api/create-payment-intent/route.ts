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
  console.log('cartProducts', cartProducts);

  const paymentIntentId = currentUser?.paymentIntentId
  const total = getTotalPrice(cartProducts)
  const stripeTotal = getTotalPrice(cartProducts) * 100
  console.log('total', total);
  
  const orderData = {
    userId: currentUser?.id,
    amount: total,
    currency: 'usd',
    status: 'pending',
    deliveryStatus: 'pending',
    paymentIntentId,
    products: cartProducts
  }
  console.log('paymentIntentId', paymentIntentId);

  // Kalau paymentIntentId ada, artinya payment intent juga sudah dibuat / ada
  if (paymentIntentId) {
    console.log('masuk')
    
    // Kalau lupa tentang definisi intent, lihat di materi
    const currentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    )

      console.log('currentIntent', currentIntent);
      

    if (currentIntent) {
      const updatedIntent = await stripe.paymentIntents.update(
        paymentIntentId,
        { amount: stripeTotal }
      )

      console.log('updatedIntent', updatedIntent)
      
      // update the order

      // definisikan variabel 2 sekaligus
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const existingOrder = await prisma.order.findFirst({ // query prisma akan mengelola data langsung ke database. Cth: prisma.order.create: artinya dia akan membuat data baru di database dengan cetakan (kalau di mongoose model) nya adalah model order yang ada di file "schema.prisma"
          where: { paymentIntentId: paymentIntentId },
        })
        console.log('existingOrder', existingOrder);

        const updatedOrder = await prisma.order.update({
          where: { paymentIntentId: paymentIntentId },
          data: {
            amount: total,
            products: cartProducts
          }
        })

        console.log('updatedOrder', updatedOrder);
        
      // Kalau tidak  ada existing order
      if (!existingOrder) {
        console.log('masuk');
        return NextResponse.json(
          { error: 'Invalid Payment Intent' },
          { status: 404 })
      }

      console.log('updatedIntent', updatedIntent);
      // Kalau ada existing order
      return NextResponse.json({ paymentIntent: updatedIntent })
    }
    // Kalau paymentIntentId tidak ada artinya payment intent juga belum ada. Maka akan dijalankan scope else untuk membuat yang baru
  }

  console.log('masuk');
  
  // create the intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: stripeTotal,
    currency: 'idr',
    automatic_payment_methods: { enabled: true } // kalau true, datanya otomatis tersimpan dan menghindari pengguna harus memasukkan rincian pembayaran setiap kali mereka ingin berbelanja di toko Anda
  })

  console.log('paymentIntent');

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
  console.log('orderData', orderData)
  
  await prisma.order.create({
    data: orderData
  })

  return NextResponse.json({ paymentIntent })
}
