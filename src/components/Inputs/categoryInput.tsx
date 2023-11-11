/* eslint-disable react/prop-types */
'use client'
import React from 'react'

import { type IconType } from 'react-icons'

interface CategoryInputProps {
  selected?: boolean
  label: string
  icon: IconType
  onClick: (value: string) => void
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  selected,
  label,
  icon: Icon,
  onClick: setCategoryValue
}) => {
  const isSelected = (selected !== null && selected !== undefined) && selected
  return (
      <div onClick={() => { setCategoryValue(label) }}
        className={`rounded-xl border-2 p-4 flex flex-col items-center gap-2 hover:border-slate-500 transition cursor-pointer ${isSelected ? 'border-slate-500' : 'border-slate-200'}`}>
            <Icon size={30} />
            <div className='font-medium'>
                {label}
            </div>
        </div>
  )
}

export default CategoryInput
