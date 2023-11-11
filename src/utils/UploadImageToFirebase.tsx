import toast from 'react-hot-toast'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import firebaseApp from '../libs/firebase'
import { type FieldValues } from 'react-hook-form'
import { type ImageInfoType } from '../app/productDetail/ProductDetailType'

interface uploadImageToFirebaseProps {
  productData: FieldValues
  uploadedImages: ImageInfoType[]
  setIsLoading: (isLoading: boolean) => void
}
export const uploadImageToFirebase = async ({ productData, uploadedImages, setIsLoading }: uploadImageToFirebaseProps): Promise<void> => {
  toast('Creating product, please wait..')
  try {
    for (const info of productData.imageInfo) {
      const image = info.image
      if (image !== null && image !== undefined) {
        const fileName = (`${new Date().getTime()} - ${image.name}`)
        const storage = getStorage(firebaseApp)
        const storageRef = ref(storage, `products/${fileName}`)
        const uploadTask = uploadBytesResumable(storageRef, image)

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log('Upload is ' + progress + '% done')
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused')
                  break
                case 'running':
                  console.log('Upload is running')
                  break
              }
            },
            (error) => {
              console.log('Error uploading image', error)
              reject(error)
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                uploadedImages.push({
                  ...info,
                  image: downloadURL
                })
                console.log('File available at', downloadURL)
                resolve()
              }).catch((error) => {
                console.log('Error getting the download URL', error)
                reject(error)
              })
            }

          )
        }
        )
      }
    }
  } catch (error) {
    setIsLoading(false)
    console.log('Error handling image uploads', error)
    toast.error('Error handling image uploads')
  }
}
