import React from 'react'
import Link from 'next/link'
import Container from '../Container'
import { Pacifico } from 'next/font/google'
import ShoppingCart from './Navigation/shoppingCart'
import UserMenu from './NavbarItems/userMenu'
import { getCurrentUser } from '@/src/actions/getCurrentUser'
import Categories from './Categories'

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400'
})

const Navbar = async (): Promise<React.ReactElement> => {
  const STORE_NAME = 'Bodat Chic'
  const currentUser = await getCurrentUser()
  return (
    <div
      className="
  sticky
  top-0
  w-full
  bg-slate-200
  z-30
  shadow-sm
  pt-1
  "
    >
      <div className="border-b-[1px]">
        <Container>
          <div
            className="
          flex
          items-center
          justify-between
          gap-3
          md:gap-0
          mb-1
          "
          >
            <Link href={'/'} className="flex items-center">
              <div
                className={`text-slate-800 text-3xl ${pacifico.className} pt-1 ms-2`}
              >
                {STORE_NAME}🌿
              </div>
            </Link>
            <div className="flex items-center gap-8 md:gap-12">
              {currentUser && (
                <h2 className='text-slate-800 '>Hi, {currentUser?.name}</h2>
              )}
              <ShoppingCart currentUser={currentUser}/>
              <UserMenu currentUser={currentUser}/>
            </div>
          </div>
        </Container>
      </div>
      <Categories/>
    </div>
  )
}

export default Navbar
