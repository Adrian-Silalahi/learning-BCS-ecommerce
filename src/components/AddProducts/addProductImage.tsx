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
              Select the available product colors and upload their images
            </div>
            <div className='text-sm'>
              You must upload an image for each of the color selected otherwise your color selection will be ignored.
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
