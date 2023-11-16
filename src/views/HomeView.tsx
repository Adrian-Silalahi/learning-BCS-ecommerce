import React from 'react'
import HomeBanner from '../components/HomeBanner'
import Container from '../components/Container'
import ProductCard from '../components/Products/productCard'
import getProducts from '../actions/getProducts'
import NullData from '../components/NullData'
import { ProductFilterParams } from '../types'
import b1 from '../assets/b1.jpg'
import Image from 'next/image'

interface HomeViewsProps{
  searchParams: ProductFilterParams 
}

const HomeViews = async({searchParams}: HomeViewsProps): Promise<React.ReactElement> => {
  const products = await getProducts(searchParams)

    return (
      <div>
        <div className='relative w-full h-[250px] mt-1'>
          <Image alt='banner1' src={b1} fill className='object-cover'/>
          <div className='absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white'>
            <div className='text-center'>
            <h1 className='font-bold text-3xl'>#ThriftFinds</h1>
            <p className='text-sm'>Summer Sale & up to 50% off!</p>
            </div>
          </div>
        </div>
      <div className="px-8 py-24">
        {products.length === 0 ? (<NullData title='Oops! No products found. Click "All" to clear filters ' /> )
        : (
          <Container className="grid grid-cols-2 lg:grid-cols-5 gap-8 ">
          {products.map((product: any) => {
            return <ProductCard key={product.id} product={product} />
          })}
        </Container>
        )}
      </div>
      </div>
    )
  }

export default HomeViews
