import React from 'react'
import HomeBanner from '../components/HomeBanner'
import Container from '../components/Container'
import { products } from '../utils/Products'
import ProductCard from '../components/Products/productCard'

const HomeViews = (): React.ReactElement => {
  return (
    <div className="p-8">
      <Container>
        <HomeBanner />
      </Container>
      <Container className="grid grid-cols-2 lg:grid-cols-5 gap-8 ">
        {products.map((product: any) => {
          return <ProductCard key={product.id} product={product} />
        })}
      </Container>
    </div>
  )
}

export default HomeViews
