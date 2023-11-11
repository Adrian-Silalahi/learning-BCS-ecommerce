/* eslint-disable react/prop-types */

import React from 'react'
import { type IconType } from 'react-icons'
import { motion } from 'framer-motion'

interface ActionButtonProps {
  icon: IconType
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, onClick, disabled }) => {
  const isDisabled = (disabled !== null && disabled !== undefined) && disabled
  return (
    <button
    onClick={onClick}
    disabled={disabled}
    className={`
    flex
    items-center
    justify-center
    rounded
    cursor-pointer
    w-[40px]
    h-[30px]
    text-slate-700
    border
    border-slate-400
    click
    hover:bg-slate-300 transition-colors duration-300
    ${isDisabled && 'opacity-50 cursor-not-allowed'}
    `}
    >
    <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} >
        <Icon size={18} />
    </motion.a>
    </button>
  )
}

export default ActionButton
