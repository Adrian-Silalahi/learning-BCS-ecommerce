import { getCurrentUser } from '@/src/actions/getCurrentUser'
import Container from '@/src/components/Container'
import FormWrap from '@/src/components/FormWrap'
import NullData from '@/src/components/NullData'
import AddProductsView from '@/src/views/AddProductsView'
import React from 'react'

const AddProducts = async (): Promise<React.ReactElement> => {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return <NullData title={"Oops.. You don't have permission"}/>
  }

  return (
    <div>
      <Container>
        <FormWrap>
          <AddProductsView/>
        </FormWrap>
      </Container>
    </div>
  )
}

export default AddProducts
