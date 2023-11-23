'use client'
import React from 'react'
import Link from 'next/link'
import TruncateText from '@/src/utils/TruncateText'
import Image from 'next/image'
import Counter from '@/src/components/Counter/counter'
import { useCart } from '@/src/hooks/useCart'
import { ProductType } from '@/src/types'

interface CartItemProps {
  product: ProductType
}

const CartItem: React.FC<CartItemProps> = ({ product }) => {
  const {
    handleRemoveProductFromCart,
    handleIncreaseProductCartQty,
    handleDecreaseProductCartQty
  } = useCart()

  return (
    <div className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center">
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <Link href={`/productDetail/${product?.productId}`}>
          <div className="relative w-[70px] aspect-square">
            <Image
              src={product?.imageInfo?.image}
              alt={product?.name}
              fill
              className="object-contain"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-between">
          <Link href={`/productDetail/${product.productId}`}>
            {TruncateText(product?.name)}
          </Link>
          <div>{product?.imageInfo?.color}</div>
          <div className="w-[70px]">
            <button
              className="text-slate-500 underline"
              onClick={() => {
                handleRemoveProductFromCart(product)
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className="justify-self-center hover:cursor-pointer">
        Rp {product?.price}
      </div>
      <div className="justify-self-center">
        <Counter
          currentQuantity={product?.quantity}
          handleDecreaseQuantity={() => {
            handleDecreaseProductCartQty(product)
          }}
          handleIncreaseQuantity={() => {
            handleIncreaseProductCartQty(product)
          }}
        />
      </div>
      <div className="justify-self-end font-semibold">
        Rp {product?.price * product?.quantity}
      </div>
    </div>
  )
}

export default CartItem
