import axios from 'axios'
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import toast from 'react-hot-toast'

interface changeStockStatusInDBProps {
  id: string
  inStock: boolean
  router: AppRouterInstance
}

export const changeStockStatusInDB = async ({ id, inStock, router }: changeStockStatusInDBProps): Promise<void> => {
  toast('Change status stock, please wait...')
  axios.put('/api/product', {
    id,
    inStock: !inStock
  }).then((response) => {
    toast.success('Stock product status changed')
    router.refresh()
  }).catch((error) => {
    toast.error('Oops! Something went wrong')
    console.log(error)
  })
}
