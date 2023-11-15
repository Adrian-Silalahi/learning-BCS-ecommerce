import getOrders from '@/src/actions/getOrders'
import getProducts from '@/src/actions/getProducts'
import getUsers from '@/src/actions/getUsers'
import Container from '@/src/components/Container'
import SummaryViews from '@/src/views/SummaryViews'
import React from 'react'
import BarGraph from './barGraph'
import getGraphData from '@/src/actions/getGraphData'

const Admin: React.FC = async () => {
  const products = await getProducts({ category: null })
  const orders = await getOrders()
  const users = await getUsers()
  const graphData = await getGraphData()

  return (
    <div className='pt-8'>
      <Container>
        <SummaryViews products={products} orders={orders} users={users}/>
        <div className='mt-4 mx-auto max-w-[1150px]'>
          <BarGraph data = {graphData}/>
        </div>
      </Container>
    </div>
  )
}

export default Admin
