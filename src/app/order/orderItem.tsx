'use client'

import { formatRupiah } from '@/src/utils/FormatRupiah'
import TruncateText from '@/src/utils/TruncateText'
import { type ProductType } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

interface OrderItemProps {
  product: ProductType
}

const OrderItem: React.FC<OrderItemProps> = ({ product }) => {
  return (
    <div className='grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center'>
        <div className='col-span-2 justify-self-start flex gap-2 md:gap-4'>
            <div className='relative w-[70px] aspect-square'>
                <Image src={product?.imageInfo.image} alt={product?.name} fill
                className='object-contain'/>
            </div>
            <div>
                <div>{TruncateText(product?.name)}</div>
                <div>{product?.imageInfo.color}</div>
            </div>
        </div>
        <div className='justify-self-center'>{formatRupiah(product?.price)}</div>
        <div className='justify-self-center'>{product?.quantity}</div>
        <div className='justify-self-end font-semibold'>Rp {(product?.price * product?.quantity).toFixed(2)}</div>
    </div>
  )
}

export default OrderItem
