/* eslint-disable react/prop-types */
'use client'

import CustomButton from '@/src/components/CustomButton'
import Heading from '@/src/components/Heading'
import Input from '@/src/components/Inputs/input'
import { type SafeUser } from '@/src/types'
import { Rating } from '@mui/material'
import { type Order, type Product, type ProductType, type Review } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface AddRatingProps {
  product: Product & {
    reviews: Review[]
  }
  currentUser: (SafeUser & {
    orders: Order[]
  }) | null
}

const AddRating: React.FC<AddRatingProps> = ({ product, currentUser }) => {
  console.log('product', product)
  console.log('currentUser', currentUser)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      comment: '',
      rating: 0
    }
  })

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const onSubmit: SubmitHandler<FieldValues> = async (defaultValuesData) => {
    setIsLoading(true)
    if (defaultValuesData.rating === 0) {
      setIsLoading(false)
      return toast.error('No rating selected')
    }
    const ratingData = { ...defaultValuesData, userId: currentUser?.id, product }

    axios.post('/api/rating', ratingData).then(() => {
      toast.success('Rating added')
      router.refresh()
      reset()
    }).catch(() => {
      toast.error('Something went wrong')
    }).finally(() => {
      setIsLoading(false)
    })
  }

  if (!currentUser || !product) return null
  
  // Jika true artinya user sudah pernah order product, yang halaman detailnya saat ini dibuka
  // Karena data product ini didapat dari ketika kita membuka halaman product detail suatu product, maka disitu ada pemanggilan produk secara spesifik dari params/id product dan data product detailnya sampai kesini
  // Maka cara baca codingan dibawah adalah => "kita cari apakah product orderan si Current User sama id nya dengan id produk yang ada di product detail saat ini dibuka. && status produuct itu harus sudah delivered. Kalau 2 syarat itu terpenuhi maka deliveredOrder akan bernilai true
  const deliveredOrder = currentUser?.orders.some((order: Order) => order.products.find((item: ProductType) => item.id === product.id) && order.deliveryStatus === 'delivered')

  // Jika true artinya user sudah pernah me-review product
  const userReview = product?.reviews?.find((review: Review) => { return review.userId === currentUser.id })

   // Cara bacanya, jika user sudah pernah review product, atau status order user belum delivered, kembalikan null
  if (userReview || !deliveredOrder) return null

  return (<div className='flex flex-col gap-2 max-w-[500px]'>
        <Heading title='Rate this product'/>
        <Rating onChange={(event, newValue) => {
          setCustomValue('rating', newValue)
        }}/>
        <Input
        id='comment'
        label='Comment'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        />
        <CustomButton label={isLoading ? 'Loading' : 'Rate Product'} onClick={handleSubmit(onSubmit)} disabled={isLoading}/>
    </div>)
}

export default AddRating
