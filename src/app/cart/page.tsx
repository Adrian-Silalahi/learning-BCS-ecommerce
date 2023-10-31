import React from 'react'
import Container from '@/src/components/Container'
import CartView from '@/src/views/CartView'
import { getCurrentUser } from '@/src/actions/getCurrentUser'

const Cart = async(): Promise<React.JSX.Element> => {
  const currentUser = await getCurrentUser()
  return (
    <div>
      <Container className="pt-8">
        <CartView currentUser={currentUser}/>
      </Container>
    </div>
  )
}

export default Cart
