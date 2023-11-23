import Container from '@/src/components/Container'
import React from 'react'
import getOrderById from '@/src/actions/getOrderByOrderId'
import OrderDetailsView from '@/src/views/OrderDetailsView'
import NullData from '@/src/components/NullData'
import { getCurrentUser } from '@/src/actions/getCurrentUser'

interface ParamProps {
  params: {
    orderId?: string
  }
}
const OrderDetail: React.FC<ParamProps> = async ({ params }) => {
  const order = await getOrderById(params)
  const currentUser = await getCurrentUser()

  if (!order) {
    return <NullData title='No order'></NullData>
  }

  if (!currentUser || currentUser.role !== 'ADMIN'){
    return <NullData title={"Oops.. You don't have permission"}/>
  }

  return (
    <div className="p-8">
      <Container>
        <OrderDetailsView order={order} />
      </Container>
    </div>
  )
}

export default OrderDetail
