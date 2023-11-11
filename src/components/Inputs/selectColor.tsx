/* eslint-disable react/prop-types */
'use client'

import React, { useCallback, useEffect, useState } from 'react'
import SelectImage from './selectImage'
import CustomButton from '../CustomButton'
import { type ImageType } from '@/src/types'

interface SelectColorProps {
  imageInfo: ImageType
  addImageInfoToState: (value: ImageType) => void
  removeImageInfoFromState: (value: ImageType) => void
  isProductCreated: boolean
}

const SelectColor: React.FC<SelectColorProps> = ({ imageInfo, addImageInfoToState, removeImageInfoFromState, isProductCreated }) => {
  const [isCheckBox, setIsCheckBox] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const isFile = file !== null && file !== undefined

  useEffect(() => {
    if (isProductCreated) {
      setIsCheckBox(false)
      setFile(null)
    }
  }, [isProductCreated])

  const handleFileChange = useCallback((value: File) => {
    setFile(value)
    addImageInfoToState({ ...imageInfo, image: value })
  }, [])

  const handleCheckBox = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxStatus = e.target.checked
    setIsCheckBox(checkboxStatus)

    if (!checkboxStatus) {
      clearImage()
    }
  }, [])

  const clearImage = (): void => {
    setFile(null)
    removeImageInfoFromState(imageInfo)
  }

  return (
        <div className='grid grid-cols-1 overflow-y-auto border-b-[1.2px] border-slate-200 items-center p-2'>
            {/* Checkbox & Label */}
            <div className='flex flex-row gap-2 items-center h-[60px]'>
                <input id={imageInfo.color} type='checkbox' checked={isCheckBox} onChange={handleCheckBox} className='cursor-pointer'/>
                <label htmlFor={imageInfo.color} className='font-medium cursor-pointer'>{imageInfo.color}</label>
            </div>
            <>
            {(isCheckBox && file === null) && (
                <div className='col-span-2 text-center'>
                <SelectImage imageInfo={imageInfo} handleFileChange={handleFileChange}/>
            </div>
            )}
            {isFile && (
                <div className='flex flex-row gap-2 text-sm col-span-2 items-center justify-between'>
                    <p>{file?.name}</p>
                    <div className='w-70px'>
                        <CustomButton label='Cancel' small outline
                        onClick={() => {
                          clearImage()
                        }} />
                    </div>
                </div>
            )}
            </>
        </div>
  )
}

export default SelectColor
