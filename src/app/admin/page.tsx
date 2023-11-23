import getOrders from '@/src/actions/getOrders'
import getProducts from '@/src/actions/getProducts'
import getUsers from '@/src/actions/getUsers'
import Container from '@/src/components/Container'
import SummaryViews from '@/src/views/SummaryViews'
import React from 'react'
import BarGraph from './barGraph'
import getDailyOrderData from '@/src/actions/getDailyOrderData'
import { getCurrentUser } from '@/src/actions/getCurrentUser'
import NullData from '@/src/components/NullData'

const Admin: React.FC = async () => {
  const products = await getProducts({ category: null })
  const orders = await getOrders()
  const users = await getUsers()
  const dailyOrderData = await getDailyOrderData()
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return <NullData title={"Oops.. You don't have permission"}/>
  }

  return (
    <div className='pt-1'>
      <Container>
        <SummaryViews products={products} orders={orders} users={users}/>
        <div className='my-16 mx-auto w-[850px]'>
          <BarGraph dailyOrderData = {dailyOrderData}/>
        </div>
      </Container>
    </div>
  )
}

export default Admin
