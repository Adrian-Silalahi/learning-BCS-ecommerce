/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable operator-linebreak */
'use client'

import { useCart } from '@/src/hooks/useCart'
import React, { useState, useEffect, useCallback } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { type StripeElementsOptions, loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import CustomButton from '@/src/components/CustomButton'
import CheckoutForm from '../app/checkout/checkoutForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const CheckoutView = (): React.ReactElement => {
  const { cartProducts } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (cartProducts) {
      setLoading(true)
      setError(false)

      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartProducts
        })
      }).then((response) => {
        setLoading(false)
        // Status 401 artinya adalah Unauthorized / user belum login
        if (response.status === 401) {
          router.push('/login')
          toast.error('Please login')
        }
        return response.json()
      }).then((response: any) => {
        setClientSecret(response.paymentIntent.client_secret)
      }).catch(() => {
        toast.error('Something went wrong')
      })
    }
  }, [cartProducts])

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating'
    }
  }

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value)
  }, [])
  return (
    <div className='w-full'>
         {(clientSecret && cartProducts) ?
             (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} handleSetPaymentSuccess={handleSetPaymentSuccess} />
        </Elements>
             )
           :
             (
               null
             )}
      {loading && <div className='text-center'>Loading Checkout...</div>}
      {error && (<div className='text-center'>Something went wrong...</div>)}
      {paymentSuccess && (
        <div className='flex items-center flex-col gap-4'>
            <div className='text-teal-500 text-center'>Payment Success</div>
            <div className='max-w-[220px] w-full'>
                <CustomButton label='View Your Orders' onClick={() => { router.push('/orders') }}/>
            </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutView
