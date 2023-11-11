/* eslint-disable react/prop-types */
'use client'

import React, { useCallback } from 'react'
import { type ImageType } from '@/src/types'
import { useDropzone } from 'react-dropzone'

interface SelectImageProps {
  imageInfo?: ImageType
  handleFileChange: (value: File) => void
}

const SelectImage: React.FC<SelectImageProps> = ({
  imageInfo,
  handleFileChange
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0])
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    }
  })

  return (
    // ...getRootProps() => memungkinkan elemen tersebut untuk merespons interaksi drag-and-drop, sehingga pengguna dapat menyeret berkas ke elemen tersebut untuk memilih gambar.
    <div {...getRootProps()}
    className='border-2 border-slate-400 p-2 border-dashed cursor-pointer text-sm font-normal text-slate-400 flex imageInfos-center justify-center'>
        <input {...getInputProps()} />
        {/* //Nyerah aku ga tau masih apa gunanya ...getInputProps() walaupun dah ku cari di gpt */}
        {isDragActive
          ? (
            <p>Drop the image here...</p>
            )
          : (
            <p>+ {imageInfo?.color} Image</p>
            )}
    </div>
  )
}

export default SelectImage
