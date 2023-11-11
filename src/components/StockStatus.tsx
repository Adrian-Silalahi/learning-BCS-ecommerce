import React from 'react'
import { type IconType } from 'react-icons'

interface StockStatusProps {
  text: string
  icon: IconType
  bg: string
  color: string
}

const StockStatus: React.FC<StockStatusProps> = ({ text, icon: Icon, bg, color }) => {
  return (
    <div className={`${bg} ${color} px-1 rounded flex items-center gap-1`}>
      {text} <Icon size={15}/>
    </div>
  )
}

export default StockStatus
