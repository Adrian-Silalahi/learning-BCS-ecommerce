import React from 'react'
import { type IconType } from 'react-icons'

interface AdminNavItemProps {
  selected?: boolean
  icon: IconType
  label: string
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({
  selected,
  icon: Icon,
  label
}) => {
  const isSelected = (selected !== null && selected !== undefined) && selected
  return (
    <div className={`flex items-center justify-center text-center gap-1 p-2 border-b-2 hover:text-slate-800  transition cursor-pointer ${isSelected ? 'border-b-slate-800 text-slate-800}' : 'border-transparent text-slate-500'}`}>
        <Icon size={20} />
        <div className='font-medium text-sm text-center'></div>
    </div>
  )
}

export default AdminNavItem
