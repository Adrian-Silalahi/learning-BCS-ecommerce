'use client'

import React from 'react'
import { type IconType } from 'react-icons'

interface ButtonProps {
  label: string
  disabled?: boolean
  outline?: boolean
  small?: boolean
  custom?: string
  icon?: IconType
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const CustomButton: React.FC<ButtonProps> = ({
  label,
  disabled,
  outline,
  small,
  custom,
  icon: Icon,
  onClick
}) => {
  const isOutline = (outline !== null && outline !== undefined) && outline
  const isSmall = (small !== null && small !== undefined) && small
  const isCustom = (custom !== null && custom !== undefined) && custom
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`disabled:opacity-70 disabled:cursor-not-allowed rounded-md hover:opacity-80 transition  w-full border-slate-700 flex items-center justify-center gap-2 
      ${isOutline ? 'bg-white' : 'bg-slate-700'} 
      ${isOutline ? 'text-slate-700' : 'text-white'}  
      ${isSmall ? 'text-sm font-light' : 'text-md font-semibold'} 
      ${isSmall ? 'py-1 px-2 border-[1px]' : 'py-3 px-4 border-2'} 
      ${isCustom ?? ''}`}
    >
      {(Icon !== null && Icon !== undefined) && <Icon size={24} />}
      {label}
    </button>
  )
}

export default CustomButton
