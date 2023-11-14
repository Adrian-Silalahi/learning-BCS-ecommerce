import React from 'react'
import HomeBanner from '../components/HomeBanner'
import Container from '../components/Container'
import ProductCard from '../components/Products/productCard'
import getProducts from '../actions/getProducts'
import NullData from '../components/NullData'
import { ProductFilterParams } from '../types'

interface HomeViewsProps{
  searchParams: ProductFilterParams 
}

const HomeViews = async({searchParams}: HomeViewsProps): Promise<React.ReactElement> => {
  const products = await getProducts(searchParams)

    return (
      <div className="p-8">
        <Container>
          <HomeBanner />
        </Container>
        {products.length === 0 ? (<NullData title='Oops! No products found. Click "All" to clear filters ' /> )
        : (
          <Container className="grid grid-cols-2 lg:grid-cols-5 gap-8 ">
          {products.map((product: any) => {
            return <ProductCard key={product.id} product={product} />
          })}
        </Container>
        )}
      </div>
    )
  }

export default HomeViews
