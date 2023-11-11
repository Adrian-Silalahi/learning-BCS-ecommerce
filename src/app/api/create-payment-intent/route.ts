import { getCurrentUser } from '@/src/actions/getCurrentUser'
import prisma from '@/src/libs/prismadb'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { type ProductType } from '../../productDetail/ProductDetailType'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16'
})

const getTotalPrice = (products: ProductType[]): number => {
  const totalPriceAllProducts = products.reduce((acc, product) => {
    const totalPriceProduct = product.price * product.quantity
    return acc + totalPriceProduct
  }, 0)

  const endPrice: any = Math.floor(totalPriceAllProducts)
  return endPrice
}

export async function POST (request: Request): Promise<NextResponse> {
  const currentUser = await getCurrentUser()

  if (currentUser === null || currentUser === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { cartProducts } = body
  const paymentIntentId = currentUser?.paymentIntentId
  const total = getTotalPrice(cartProducts) * 100
  const orderData = {
    user: { connect: { id: currentUser.id } },
    amount: total,
    currency: 'usd',
    status: 'pending',
    deliveryStatus: 'pending',
    paymentIntentId,
    products: cartProducts
  }

  // Kalau paymentIntentId ada, artinya payment intent juga sudah dibuat / ada
  if (paymentIntentId !== null && paymentIntentId !== undefined) {
    // Kalau lupa tentang definisi intent, lihat di materi
    const currentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    )

    if (currentIntent !== null && currentIntent !== undefined) {
      const updatedIntent = await stripe.paymentIntents.update(
        paymentIntentId,
        { amount: total }
      )
      // update the order

      // definisikan variabel 2 sekaligus
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [existingOrder, updateOrder] = await Promise.all([
        // Yang akan menjadi isi existingOrder
        prisma.order.findFirst({ // query prisma akan mengelola data langsung ke database. Cth: prisma.order.create: artinya dia akan membuat data baru di database dengan cetakan (kalau di mongoose model) nya adalah model order yang ada di file "schema.prisma"
          where: { paymentIntentId }
        }),

        // Yang akan menjadi isi updateOrder
        prisma.order.update({
          where: { paymentIntentId },
          data: {
            amount: total,
            products: cartProducts
          }
        })
      ])

      // Kalau tidak  ada existing order
      if (existingOrder === null || existingOrder === undefined) {
        return NextResponse.json(
          { error: 'Invalid Payment Intent' },
          { status: 404 })
      }

      // Kalau ada existing order
      return NextResponse.json({ paymentIntent: updatedIntent })
    }
    // Kalau paymentIntentId tidak ada artinya payment intent juga belum ada. Maka akan dijalankan scope else untuk membuat yang baru
  }
  // create the intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'usd',
    automatic_payment_methods: { enabled: true } // kalau true, datanya otomatis tersimpan dan menghindari pengguna harus memasukkan rincian pembayaran setiap kali mereka ingin berbelanja di toko Anda
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
