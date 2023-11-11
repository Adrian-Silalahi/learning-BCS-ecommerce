import Container from '@/src/components/Container'
import FormWrap from '@/src/components/FormWrap'
import CheckoutView from '@/src/views/CheckoutView'
import React from 'react'

const Checkout = async (): Promise<React.ReactElement> => {
  return (
    <div>
        <Container>
            <FormWrap className="my-10">
                <CheckoutView />
            </FormWrap>
        </Container>
    </div>
  )
}

export default Checkout
