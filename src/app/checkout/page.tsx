import Container from '@/src/components/Container'
import FormWrap from '@/src/components/FormWrap'
import React from 'react'
import CheckoutClient from './checkoutClient'

const Checkout = () => {
  return (
    <div>
        <Container>
            <FormWrap>
                <CheckoutClient/>
            </FormWrap>
        </Container>
    </div>
  )
}

export default Checkout