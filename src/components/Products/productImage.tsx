'use client'

import {
  type ProductType,
  type ImageInfoType
} from '@/src/types'
import Image from 'next/image'
import React from 'react'

interface ProductImageProps {
  selectedProduct: ProductType
  product: any
  handleColorSelect: (value: ImageInfoType) => void
}

const ProductImage: React.FC<ProductImageProps> = ({
  selectedProduct, 
  product, 
  handleColorSelect 

}) => {
  return (
    <div className="grid grid-cols-6 gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      {/* Pilihan Gambar */}
      <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
        {product.imageInfo.map((imageInfo: ImageInfoType) => {
          return (
            <div
              key={imageInfo.color}
              onClick={() => { handleColorSelect(imageInfo) }}
              className={`relative w-[80%] aspect-square rounded border-teal-300 ${
                selectedProduct.imageInfo.color === imageInfo.color
                  ? 'border-[1.5px]'
                  : 'border-none'
              }`}
            >
              <Image
                src={imageInfo.image}
                alt={imageInfo.color}
                fill
                className="object-contain"
              />
            </div>
          )
        })}
      </div>

      {/* Gambar Besar */}
      <div className="col-span-5 relative aspect-square">
        <Image
          fill
          src={selectedProduct.imageInfo.image}
          alt={selectedProduct.name}
          className="w-full h-full object-contain max-h-[500px] min-h-[300px] sm:min-h-[400px]"
        />
      </div>
    </div>
  )
}

export default ProductImage
