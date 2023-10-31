import React from 'react'

interface BackDropProps {
  changeToggle: () => void
}

const BackDrop: React.FC<BackDropProps> = ({ changeToggle }) => {
  return (
    <div
      onClick={changeToggle}
      className="z-20 bg-slate-50/40  w-screen h-screen fixed top-0 left-0"
    ></div>
  )
}

export default BackDrop
