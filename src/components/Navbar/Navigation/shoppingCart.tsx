'use client'

import { useCart } from '@/src/hooks/useCart'
import { type SafeUser } from '@/src/types'
import { useRouter } from 'next/navigation'
import React from 'react'
import { CiShoppingCart } from 'react-icons/ci'

interface ShoppingCartProps {
  currentUser: SafeUser | null
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ currentUser }) => {
  const router = useRouter()
  const { cartTotalQuantity } = useCart()
  const validCartTotalQuantity = cartTotalQuantity < 0 ? 0 : cartTotalQuantity
  return (
    <div
      className="relative cursor-pointer"
      onClick={() => { router.push('/cart') }}
    >
      <div className="text-3xl">
        <CiShoppingCart />
      </div>
      <span className="absolute top-[-10px] right-[-10px] bg-slate-700 text-white h-6 w-6 rounded-full flex items-center justify-center text-sm">
        {currentUser ? validCartTotalQuantity : 0}
      </span>
    </div>
  )
}

export default ShoppingCart
