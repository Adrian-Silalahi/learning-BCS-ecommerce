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
  const { cartProducts, isCheckoutLoading, setIsCheckoutLoading } = useCart()
  const [error, setError] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log('cartProducts', cartProducts);
    
    if (cartProducts?.length) {
      setIsCheckoutLoading(true)
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
        console.log('response', response);
        setIsCheckoutLoading(false)
        if (response.status === 401) {
          router.push('/login')
          toast.error('Please login')
        }
        return response.json()
      }).then((response: any) => {
        console.log('masuk');
        setClientSecret(response.paymentIntent.client_secret)
      }).catch(() => {
        console.log('masuk');
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
         {(clientSecret && cartProducts?.length) ?(
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} handleSetPaymentSuccess={handleSetPaymentSuccess} />
        </Elements>
        ):isCheckoutLoading? (
            <div>
                <div className='text-center'>Loading...</div>
            </div>
        ):paymentSuccess ? (
            <div className='flex items-center flex-col gap-4'>
                <div className='text-teal-500 text-center'>Payment Success</div>
                <div className='max-w-[220px] w-full'>
                    <CustomButton label='View Your Orders' onClick={() => { router.push('/orders') }}/>
                </div>
            </div>
        ):(
            <></>
        )}
      {error && (<div className='text-center'>Something went wrong...</div>)}
    </div>
  )
}

export default CheckoutView
