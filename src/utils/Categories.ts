import { MdStorefront } from 'react-icons/md'
import { PiBagSimpleBold, PiHoodie, PiPants, PiShirtFolded, PiTShirtBold } from 'react-icons/pi'
import { TbJacket } from 'react-icons/tb'

export const categories = [
  {
    label: 'All',
    icon: MdStorefront
  },
  {
    label: 'T-shirt',
    icon: PiTShirtBold, 
  },
  {
    label: 'Shirt',
    icon: PiShirtFolded
  },
  {
    label: 'Vest',
    icon: TbJacket
  },
  {
    label: 'Pants',
    icon: PiPants
  },
  {
    label: 'Jacket',
    icon: PiHoodie
  },
  {
    label: 'Tote bag',
    icon: PiBagSimpleBold
  }
]
