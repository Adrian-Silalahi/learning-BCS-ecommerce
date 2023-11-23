import axios from 'axios'
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { type FieldValues } from 'react-hook-form'
import toast from 'react-hot-toast'

interface postProductToDataBaseProps {
  currentProductData: FieldValues
  setIsProductCreated: (isProductCreated: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  router: AppRouterInstance
}

export const postProductToDataBase = ({ currentProductData, setIsProductCreated, setIsLoading, router }: postProductToDataBaseProps): void => {
  console.log('currentProductData', currentProductData)
  axios.post('/api/product', currentProductData).then(() => {
    toast.success('Product created')
    setIsProductCreated(true)
    router.refresh()
  }).catch((error) => {
    toast.error('Something went wrong when saving product to db')
    console.log(error)
  }).finally(() => {
    setIsLoading(false)
  })
}
