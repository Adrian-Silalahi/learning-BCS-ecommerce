import { imageInfos } from '@/src/utils/Colors'
import React from 'react'
import SelectColor from '../Inputs/selectColor'
import { type ImageType } from '@/src/types'

interface AddProductImageProps {
  addImageInfoToState: (value: ImageType) => void
  removeImageInfoFromState: (value: ImageType) => void
  isProductCreated: boolean
}

const AddProductImage: React.FC<AddProductImageProps> = ({ addImageInfoToState, removeImageInfoFromState, isProductCreated }) => {
  return (
    <div className='w-full flex flex-col flex-wrap gap-4'>
          <div>
            <div className='font-bold'>
            Pilih warna produk yang tersedia dan unggah gambarnya
            </div>
            <div className='text-sm'>
            Anda harus mengunggah gambar untuk setiap warna yang anda pilih jika tidak, pemilihan warna Anda akan diabaikan.
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            {imageInfos.map((imageInfo, index) => {
              return <SelectColor
              key={index}
              imageInfo={imageInfo}
              addImageInfoToState={addImageInfoToState}
              removeImageInfoFromState={removeImageInfoFromState}
              isProductCreated={isProductCreated}/>
            })}
          </div>
      </div>
  )
}

export default AddProductImage
