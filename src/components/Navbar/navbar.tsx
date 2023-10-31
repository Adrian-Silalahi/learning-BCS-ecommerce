import Link from 'next/link'
import Container from '../Container'
import { Pacifico } from 'next/font/google'
import CartCount from './Navigation/shoppingCart'
import UserMenu from './NavbarItems/userMenu'
import { getCurrentUser } from '@/src/actions/getCurrentUser'


const pacifico = Pacifico({ subsets: ['latin'], weight: ['400'] })

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
  py-2
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
          "
          >
            <Link href={'/'} className="flex items-center">
              <div
                className={`text-black text-2xl ${pacifico.className} pt-1 ms-2`}
              >
                {STORE_NAME}
              </div>
            </Link>
            <div className="hidden md:block">Search</div>
            <div className="flex items-center gap-8 md:gap-12">
              <CartCount />
              <UserMenu currentUser={currentUser}/>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Navbar

