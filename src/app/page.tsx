import React from 'react'
import HomeViews from '../views/HomeView'
import { ProductFilterParams } from '../types'

interface HomeViewsProps{
  searchParams: ProductFilterParams
}

const Home = ({searchParams}: HomeViewsProps): React.JSX.Element => {
  console.log('searchParams',searchParams);
  
  return <HomeViews searchParams={searchParams} />
}

export default Home
