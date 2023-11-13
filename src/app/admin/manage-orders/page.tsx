import { getCurrentUser } from '@/src/actions/getCurrentUser'
import getOrders from '@/src/actions/getOrders'
import Container from '@/src/components/Container'
import NullData from '@/src/components/NullData'
import ManageOrdersView from '@/src/views/ManageOrdersView'
import React from 'react'

const ManageOrders = async (): Promise<React.ReactElement> => {
  const orders = await getOrders()
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return <NullData title={"Oops.. You don't have permission"}/>
  }
  return (
    <div className='pt-8'>
      <Container>
        <ManageOrdersView orders={orders}/>
      </Container>
    </div>
  )
}

export default ManageOrders
