import axios from 'axios'
import { type FirebaseStorage, deleteObject, ref } from 'firebase/storage'
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import toast from 'react-hot-toast'
import { type ImageInfoType } from '@/src/types'

interface deleteProductProps {
  id: string
  imageInfo: ImageInfoType[]
  storage: FirebaseStorage
  router: AppRouterInstance
}

export const deleteProduct = async ({ id, imageInfo, storage, router }: deleteProductProps): Promise<void> => {
  const deleteImageFromFirebase = async (): Promise<void> => {
    try {
      for (const info of imageInfo) {
        const image = info.image
        if (image) {
          const imageRef = ref(storage, image)
          await deleteObject(imageRef)
          console.log('image deleted', image)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteProductFromDatabase = (): void => {
    axios.delete(`/api/product/${id}`)
      .then((response) => {
        toast.success('Product deleted')
        router.refresh()
      }).catch((error) => {
        toast.error('Failed to delete product')
        console.log(error)
      })
  }

  toast('Deleting product, please wait')
  await deleteImageFromFirebase()
  deleteProductFromDatabase()
}
