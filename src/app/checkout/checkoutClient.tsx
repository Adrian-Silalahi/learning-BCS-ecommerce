'use client'

import { useCart } from '@/src/hooks/useCart';
import { Elements} from '@stripe/react-stripe-js'
import {StripeElementsOptions, loadStripe} from '@stripe/stripe-js'
import { useRouter } from 'next/navigation';
import {useState, useEffect, useCallback} from 'react'
import toast from 'react-hot-toast';
import CheckoutForm from './checkoutForm';
import CustomButton from '@/src/components/CustomButton';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const CheckoutClient = () => {
    const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [clientSecret, setClientSecret] = useState('')
    const [paymentSuccess, setPaymentSuccess] = useState(false)    

    const router = useRouter()
    
    useEffect(()=> {
        // create a paymentIntent as soon as the page loads
        if (cartProducts){
            setLoading(true)
            setError(false)

            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartProducts: cartProducts,
                    payment_intent_id: paymentIntent
                }),
            }).then((response)=>{
                setLoading(false)
                // Status 401 artinya adalah Unauthorized / user belum login
                if(response.status === 401){
                    return router.push('/login')
                }

                return response.json()
            }).then((response) => {
                setClientSecret(response.paymentIntent.client_secret)
                handleSetPaymentIntent(response.paymentIntent.id)
            }).catch((error) => {
                console.log("Error", error);
                toast.error('Something went wrong')
                
            })
        }
    }, [cartProducts, paymentIntent])

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            labels: 'floating',
        }
    }

    const handleSetPaymentSuccess = useCallback((value: boolean) => {
        setPaymentSuccess(value)
    }, [])

    return <div className='w-full'>
         {clientSecret && cartProducts &&(
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} handleSetPaymentSuccess={handleSetPaymentSuccess} />
        </Elements>
      )}
      {loading && <div className='text-center'>Loading Checkout...</div>}
      {error && (<div className='text-center'>Something went wrong...</div>)}
      {paymentSuccess && (
        <div className='flex items-center flex-col gap-4'>
            <div className='text-teal-500 text-center'>Payment Success</div>
            <div className='max-w-[220px] w-full'>
                <CustomButton label='View Your Orders' onClick={() => router.push('/order')}/>
            </div>
        </div>
      )}
    </div>
}

export default CheckoutClient;