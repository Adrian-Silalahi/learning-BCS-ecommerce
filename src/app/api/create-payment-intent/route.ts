import { getCurrentUser } from '@/src/actions/getCurrentUser';
import prisma from '@/src/libs/prismadb';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { type ProductType } from '../../productDetail/ProductDetailType';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16',
});

const getTotalPrice = (products: ProductType[]) => {
    const totalPriceAllProducts = products.reduce((acc, product) => {
        const totalPriceProduct = product.price * product.quantity;
        return acc + totalPriceProduct;
    },0);

    const endPrice: any = Math.floor(totalPriceAllProducts)
    return endPrice;
}

export async function POST(request: Request) {
    const currentUser = await getCurrentUser()

    if(!currentUser){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const body = await request.json()
    const {cartProducts, payment_intent_id} = body
    const total = getTotalPrice(cartProducts) * 100
    const orderData = {
        user: {connect: {id: currentUser.id}},
        amount: total,
        currency: 'usd',
        status: 'pending',
        deliveryStatus: 'pending',
        paymentIntentId: payment_intent_id,
        products: cartProducts
    }
    
     // Kalau payment_intent_id tidak ada, artinya payment intent juga belum ada
    if(payment_intent_id){
        // Kalau lupa tentang definisi intent, lihat di materi
        const current_intent = await stripe.paymentIntents.retrieve(
            payment_intent_id
        )

        if (current_intent){
            const updated_intent = await stripe.paymentIntents.update(
                payment_intent_id,
                { amount: total }
            )
            // update the order
    
            // definisikan variabel 2 sekaligus
            const [existing_order, update_order] = await Promise.all([
                // Yang akan menjadi isi existing_order
                prisma.order.findFirst({ // query prisma akan mengelola data langsung ke database. Cth: prisma.order.create: artinya dia akan membuat data baru di database dengan cetakan (kalau di mongoose model) nya adalah model order yang ada di file "schema.prisma"
                    where: { paymentIntentId: payment_intent_id },
                }),

                // Yang akan menjadi isi update_order
                prisma.order.update({
                    where: { paymentIntentId: payment_intent_id },
                    data: {
                        amount: total,
                        products: cartProducts
                    }
                })
            ]);
    
            // Kalau tidak  ada existing order
            if(!existing_order){
                return NextResponse.json(
                    {error: 'Invalid Payment Intent'}, 
                    {status: 404})
            }
    
            // Kalau ada existing order
            return NextResponse.json({ paymentIntent: updated_intent })
        }
    // Kalau payment_intent_id tidak ada artinya payment intent juga belum ada. Maka akan dijalankan scope else untuk membuat yang baru
    }else {
        // create the intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: 'usd',
            automatic_payment_methods: { enabled: true }, // kalau true, datanya otomatis tersimpan dan menghindari pengguna harus memasukkan rincian pembayaran setiap kali mereka ingin berbelanja di toko Anda
        });

        // create the order
        orderData.paymentIntentId = paymentIntent.id

        await prisma.order.create({
            data: orderData,
        });
        return NextResponse.json({paymentIntent})
    }

}
