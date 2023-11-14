import { getCurrentUser } from '@/src/actions/getCurrentUser'
import { type Order, type ProductType, type Review } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST (request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { comment, rating, product, userId } = body

  // Jika true artinya user sudah pernah order product, yang halaman detailnya saat ini dibuka
  // Karena data product ini didapat dari ketika kita membuka halaman product detail suatu product, maka disitu ada pemanggilan produk secara spesifik dari params/id product dan data product detailnya sampai kesini
  // Maka cara baca codingan dibawah adalah => "kita cari apakah product orderan si Current User sama id nya dengan id produk yang ada di product detail saat ini dibuka. && status produuct itu harus sudah delivered. Kalau 2 syarat itu terpenuhi maka deliveredOrder akan bernilai true
  const deliveredOrder = currentUser?.orders.some((order: Order) => order.products.find((item: ProductType) => item.id === product.id) && order.deliveryStatus === 'delivered')


  // Jika true artinya user sudah pernah me-review product. Pengecekan ini dimaksudkan agar user tidak bisa men-review product lebih dari 1 kali
  const userReview = product?.reviews?.find(((review: Review) => { return review.userId === currentUser.id }))

  // Cara bacanya, jika user sudah pernah review product, ataupun status ordernya belum delivered, kembalikan error
  if (userReview || !deliveredOrder) {
    return NextResponse.error()
  }

  const review = await prisma?.review.create({
    data: {
      comment,
      rating,
      productId: product.id,
      userId
    }
  })

  return NextResponse.json(review)
}
