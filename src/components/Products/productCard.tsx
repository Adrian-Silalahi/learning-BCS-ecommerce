'use client'

import React from 'react'
import Image from 'next/image'
import TruncateText from '@/src/utils/TruncateText'
import { Rating } from '@mui/material'
import { formatRupiah } from '@/src/utils/FormatRupiah'
import { useRouter } from 'next/navigation'
import AverageRating from '@/src/utils/AverageRating'

interface ProductCardProps {
  product: any
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter()
  const handleClick = (): void => {
    router.push(`/productDetail/${product?.id}`)
  }

  return (
    <div
      className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-sm"
      onClick={() => { handleClick() }}
    >
      <div className="flex flex-col items-center w-full gap-1">
        {/* Image */}
        <div className="aspect-square overflow-hidden relative w-full mb-4">
          <Image
            fill
            src={product?.imageInfo[0].image}
            alt={product?.name}
            className="w-full h-full object-contain "
          />
        </div>

        {/* Title */}
        <div className=" h-[50px]">{TruncateText(product?.name)}</div>

        {/* Rating */}
        <div>
          <Rating value={AverageRating(product?.reviews)} readOnly />
        </div>

        {/* Reviews */}
        <div>{product?.reviews?.length} reviews</div>

        {/* Price */}
        <div className="font-semibold">{formatRupiah(product?.price)}</div>
      </div>
    </div>
  )
}

export default ProductCard
