'use client'

import CustomButton from '@/src/components/CustomButton'
import Heading from '@/src/components/Heading'
import { useCart } from '@/src/hooks/useCart'
import { formatRupiah } from '@/src/utils/FormatRupiah'
import { PaymentElement, useElements, useStripe, AddressElement } from '@stripe/react-stripe-js'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface CheckoutFormProps {
  clientSecret: string
  handleSetPaymentSuccess: (value: boolean) => void
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, handleSetPaymentSuccess }) => {
  const { cartTotalPrice, handleClearCart, isCheckoutLoading,  setIsCheckoutLoading } = useCart()
  const formattedPrice = formatRupiah(cartTotalPrice)
  const stripe = useStripe()
  const elements = useElements()

  const deleteUserIntentFromDB = (): void => {
    axios.delete('/api/delete-payment-intent').then(() => {
      setIsCheckoutLoading(false)
      handleSetPaymentSuccess(true)
      handleClearCart()
      toast.success('Checkout Success')
    })
  }

  useEffect(() => {
    if (!stripe) {
      return
    }
    if (!clientSecret) {
      return
    }
    handleSetPaymentSuccess(false)
  }, [stripe])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }
    setIsCheckoutLoading(true)
    stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })
      .then((result) => {
        if (!result.error) {
          deleteUserIntentFromDB()
        }
      })
  }

  return (
    <form onSubmit={handleSubmit} id='payment-form'>
      <div className='mb-6'>
        <Heading title='Enter your details to complete checkout' />
      </div>
      <h2 className='font-semibold mb-2'>Address Information</h2>
      <AddressElement options={{
        mode: 'shipping',
        allowedCountries: ['ID']
      }}/>
      <h2 className='font-semibold mt-4 mb-2'>Payment Information</h2>
      <PaymentElement id='payment-element' options={{ layout: 'tabs' }}/>
      <div className='py-4 text-center text-slate-700 text-xl font-bold'>
        Total: {formattedPrice}
      </div>
      <CustomButton label={isCheckoutLoading ? 'Processing' : 'Pay now'}
      disabled={isCheckoutLoading}
      onClick={() => {}}/>
    </form>
  )
}

export default CheckoutForm
