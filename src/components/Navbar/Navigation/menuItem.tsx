import React from 'react'

interface MenuItemProps {
  children: React.ReactNode
  changeToggle: () => void
}

const MenuItem: React.FC<MenuItemProps> = ({ children, changeToggle }) => {
  return (
    <div
      onClick={changeToggle}
      className="px-4 py-3 hover:bg-neutral-100 transition"
    >
      {children}
    </div>
  )
}

export default MenuItem
