/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/react-in-jsx-scope */
'use client'

import Heading from '@/src/components/Heading'
import { useState, useEffect, useCallback } from 'react'
import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form'
import AddProductForm from '../components/AddProducts/addProductForm'
import AddProductCategory from '../components/AddProducts/addProductCategory'
import { type ImageType } from '../types'
import AddProductImage from '../components/AddProducts/addProductImage'
import CustomButton from '../components/CustomButton'
import toast from 'react-hot-toast'
import { type ImageInfoType } from '../app/productDetail/ProductDetailType'
import { uploadImageToFirebase } from '../utils/UploadImageToFirebase'
import { postProductToDataBase } from '../utils/PostProductToDataBase'
import { useRouter } from 'next/navigation'

const AddProductsView = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false)
  const [imageInfoTemporary, setImageInfoTemporary] = useState<ImageType[] | null>()
  const [isProductCreated, setIsProductCreated] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      description: '',
      brand: '',
      category: '',
      inStock: false,
      imageInfo: [],
      price: ''
    }
  })
  // Lihat di Materi cara penggunaan dari defaultValues react-hook-form

  useEffect(() => {
    setFieldValue('imageInfo', imageInfoTemporary)
  }, [imageInfoTemporary])

  useEffect(() => {
    if (isProductCreated) {
      reset()
      setImageInfoTemporary(null)
      setIsProductCreated(false)
    }
  }, [isProductCreated])

  const onSubmit: SubmitHandler<FieldValues> = async (productData) => {
    setIsLoading(true)
    const uploadedImages: ImageInfoType[] = []
    const categoryNotSelected = !productData.category
    const imageNotEntered = !productData.imageInfo || productData.imageInfo.length === 0

    if (categoryNotSelected) {
      setIsLoading(false)
      return toast.error('Please select a category')
    }

    if (imageNotEntered) {
      setIsLoading(false)
      return toast.error('Please add at least one image')
    }

    await uploadImageToFirebase({ productData, uploadedImages, setIsLoading })
    const currentProductData = { ...productData, imageInfo: uploadedImages }
    postProductToDataBase({ currentProductData, setIsProductCreated, setIsLoading, router })
  }

  // syntax dibawah adalah cara mengambil value category dari fieldvalues  (value terbaru/terkini)
  const category = watch('category')

  // fungsi dibawah adalah cara set nilai fieldvalues
  const setFieldValue = (field: string, selectedLabel: any): void => {
    setValue(field, selectedLabel, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }

  const addImageInfoToState = useCallback((value: ImageType) => {
    setImageInfoTemporary((prev) => {
      if (!prev) {
        return [value]
      }
      return [...prev, value]
    })
  }, [])

  const removeImageInfoFromState = useCallback((value: ImageType) => {
    setImageInfoTemporary((prev) => {
      if (prev) {
        const filteredImageInfo = prev.filter((item) => item.color !== value.color)
        return filteredImageInfo
      }
      return prev
    })
  }, [])

  return (
    <>
      <Heading title='Add Products' center/>
      <AddProductForm isLoading={isLoading} register={register} errors={errors}/>
      <AddProductCategory category={category} setFieldValue={setFieldValue}/>
      <AddProductImage
      addImageInfoToState={addImageInfoToState}
      removeImageInfoFromState={removeImageInfoFromState}
      isProductCreated={isProductCreated}
      />
      <CustomButton label={isLoading ? 'Loading...' : 'Add Product'} disabled={isLoading} onClick={handleSubmit(onSubmit)} />
    </>
  )
}

export default AddProductsView
