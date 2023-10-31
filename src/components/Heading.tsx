import React from 'react'
import { DM_Serif_Display } from 'next/font/google'

const dmserif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400']
})

interface HeadingProps {
  title: string
  center?: boolean
  serif?: boolean
  className?: string
}

const Heading: React.FC<HeadingProps> = ({
  title,
  center,
  className,
  serif
}) => {
  const isCenter = center ?? false
  const isSerif = serif ?? false
  return (
    <div className={isCenter ? 'text-center' : 'text-start'}>
      <h1
        className={`font-bold text-2xl text-slate-800 ${className} ${
          isSerif ? dmserif.className : ''
        }`}
      >
        {title}
      </h1>
    </div>
  )
}

export default Heading
