import { getCurrentUser } from '@/src/actions/getCurrentUser'
import getProducts from '@/src/actions/getProducts'
import Container from '@/src/components/Container'
import NullData from '@/src/components/NullData'
import ManageProductsView from '@/src/views/ManageProductsView'
import React from 'react'

const ManageProducts = async (): Promise<React.ReactElement> => {
  const products = await getProducts({ category: null })
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return <NullData title={"Oops.. You don't have permission"}/>
  }
  return (
    <div className='pt-8'>
      <Container>
        <ManageProductsView products={products}/>
      </Container>
    </div>
  )
}

export default ManageProducts
