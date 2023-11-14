import { getCurrentUser } from '@/src/actions/getCurrentUser'
import getOrdersByUserId from '@/src/actions/getOrdersByUserId'
import Container from '@/src/components/Container'
import NullData from '@/src/components/NullData'
import OrdersView from '@/src/views/OrdersView'
import React from 'react'

const Orders = async (): Promise<React.ReactElement> => {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser)

  if (isInvalidUser) {
    return <NullData title={"Oops.. You don't have permission"}/>
  }

  const orders = await getOrdersByUserId(currentUser.id)

  if (!orders) {
    return <NullData title={'No orders yet...'}/>
  }
  return (
    <div className='pt-8'>
      <Container>
        <OrdersView orders={orders}/>
      </Container>
    </div>
  )
}

export default Orders
