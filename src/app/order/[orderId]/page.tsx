import Container from '@/src/components/Container'
import React from 'react'
import getOrderById from '@/src/actions/getOrderById'
import OrderDetailsView from '@/src/views/OrderDetailsView'
import NullData from '@/src/components/NullData'

interface ParamProps {
  params: {
    orderId?: string
  }
}
const OrderDetail: React.FC<ParamProps> = async ({ params }) => {
  const order = await getOrderById(params)

  if (!order) {
    return <NullData title='No order'></NullData>
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
