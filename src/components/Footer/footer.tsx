import React from 'react'
import Container from '../Container'
import FooterList from './footerList'
import Link from 'next/link'
import { MdFacebook } from 'react-icons/md'
import {
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillYoutube
} from 'react-icons/ai'
const Footer = (): React.ReactElement => {
  return (
    <footer className="bg-slate-700 text-slate-200 text-sm ">
      <Container>
        <div className="flex flex-col md:flex-row justify-between pt-16 pb-8 ">
          {/* footer list 1 */}
          <FooterList>
            <h3 className="text-base font-bold">Kategori Toko</h3>
            <Link href={'#'}>Denims</Link>
            <Link href={'#'}>Sports</Link>
            <Link href={'#'}>Joggers</Link>
            <Link href={'#'}>Pants</Link>
            <Link href={'#'}>Outdoors</Link>
            <Link href={'#'}>Cargos</Link>
          </FooterList>

          {/* footer list 2 */}
          <FooterList>
            <h3 className="text-base font-bold">Customer Service</h3>
            <Link href={'#'}>Hubungi Kami</Link>
            <Link href={'#'}>Kebijakan Pengiriman</Link>
            <Link href={'#'}>Pengembalian & Penukaran</Link>
            <Link href={'#'}>FAQs</Link>
          </FooterList>

          {/* footer list 3 */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-base font-bold mb-2">Tentang Kami</h3>
            <p>
              Di toko pakaian kami, kami berdedikasi untuk memberikan yang
              terbaik dan penghematan termurah untuk pelanggan kami. Dengan
              berbagai pilihan kaos, celana panjang, jaket dan rompi.
            </p>
            <p>
              &copy; {new Date().getFullYear()} Bodat Chic Sec, All rights
              reserved
            </p>
          </div>

          {/* footer list 4 */}
          <FooterList>
            <h3 className="text-base font-bold">Ikuti Kami</h3>
            <div className="flex gap-2">
              <Link href={'#'}>
                <MdFacebook size={24} />
              </Link>
              <Link href={'#'}>
                <AiFillTwitterCircle size={24} />
              </Link>
              <Link href={'#'}>
                <AiFillInstagram size={24} />
              </Link>
              <Link href={'#'}>
                <AiFillYoutube size={24} />
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
