import Container from '@/src/components/Container'
import ProductDetailView from '@/src/views/ProductDetailView'
import React from 'react'
import ListRating from './listRating'
import { products } from '@/src/utils/Products'

interface ParamProps {
  params: {
    productId: string
  }
}

const ProductDetail: React.FC<ParamProps> = ({ params }) => {
  const product = products.find((item) => item.id === params.productId)

  return (
    <div className="p-8">
      <Container>
        <ProductDetailView product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <div>Add Rating</div>
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  )
}

export default ProductDetail
