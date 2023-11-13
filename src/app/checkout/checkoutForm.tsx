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
  const { cartTotalPrice, handleClearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const formattedPrice = formatRupiah(cartTotalPrice)
  const stripe = useStripe()
  const elements = useElements()

  const deleteUserIntentFromDB = (): void => {
    axios.delete('/api/delete-payment-intent')
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
    setIsLoading(true)
    stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })
      .then((result) => {
        if (!result.error) {
          toast.success('Checkout Success')
          handleClearCart()
          handleSetPaymentSuccess(true)
          deleteUserIntentFromDB()

        }
        setIsLoading(false)
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
        allowedCountries: ['US', 'KE']
      }}/>
      <h2 className='font-semibold mt-4 mb-2'>Payment Information</h2>
      <PaymentElement id='payment-element' options={{ layout: 'tabs' }}/>
      <div className='py-4 text-center text-slate-700 text-xl font-bold'>
        Total: {formattedPrice}
      </div>
      <CustomButton label={isLoading ? 'Processing' : 'Pay now'}
      disabled={isLoading}
      onClick={() => {}}/>
      {/* onClick kosong namun kalau ditekan tetap menjalankan fungsi handleSubmit dikarenakan,
        ketika Anda meletakkan elemen button dalam elemen <form> yang memiliki atribut onSubmit={handleSubmit}, maka secara otomatis elemen CustomButton akan bertindak sebagai tombol "Submit" default untuk formulir. */}
    </form>
  )
}

export default CheckoutForm
