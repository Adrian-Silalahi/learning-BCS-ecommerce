'use client'
import Link from 'next/link'
import React from 'react'
import { MdArrowBack } from 'react-icons/md'
import { useCart } from '../hooks/useCart'
import Heading from '../components/Heading'
import CustomButton from '../components/CustomButton'
import CartItem from '../app/cart/CartItem'
import { SafeUser } from '../types'
import { useRouter } from 'next/navigation'

interface CartViewProps {
  currentUser?: SafeUser | null
}

const CartView: React.FC<CartViewProps> = ({currentUser}) => {
  const { cartProducts, handleClearCart, cartTotalPrice } = useCart()

  const router = useRouter()

  const emprtyCartProducts = cartProducts === null || cartProducts.length === 0
  const isCartProducts = cartProducts !== null && cartProducts.length !== 0
  if (emprtyCartProducts) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-2xl">Your cart is empty</div>
        <div>
          <Link
            href={'/'}
            className="
                  text-slate-500 flex items-center gap-1 mt-2"
          >
            <MdArrowBack />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div>
      <Heading title="Shopping Cart" center />
      <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-8">
        <div className="col-span-2 justify-self-start">PRODUCT</div>
        <div className="justify-self-center">PRICE</div>
        <div className="justify-self-center">QUANTITY</div>
        <div className="justify-self-end">TOTAL</div>
      </div>
      <div>
        {isCartProducts &&
          cartProducts.map((cartProduct) => {
            return <CartItem product={cartProduct} key={cartProduct.id} />
          })}
      </div>
      <div className="border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4">
        <div className="w-[90px]">
          <CustomButton
            label="Clear Cart"
            onClick={() => {
              handleClearCart()
            }}
            small
            outline
          />
        </div>
        <div>
          <div className="text-sm flex flex-col gap-1 items-start">
            <div className="flex justify-between w-full text-base font-semibold">
              <span>Subtotal</span>
              <span>{cartTotalPrice}</span>
            </div>
            <p className="text-slate-500">
              Taxes and shipping calculate at checkout
            </p>
            <CustomButton label={currentUser? 'Checkout' : 'Login to checkout'} 
            outline={currentUser? false : true}
            onClick={() => {
              currentUser? router.push('/checkout') : router.push('/login')
            }} 
            />
            <Link
              href={'/'}
              className="
                  text-slate-500 flex items-center gap-1 mt-2"
            >
              <MdArrowBack />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartView
