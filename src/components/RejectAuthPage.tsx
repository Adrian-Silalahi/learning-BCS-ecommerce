'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const RejectAuthPage = (): React.ReactElement => {
  const router = useRouter()
  useEffect(() => {
    router.push('/')
    router.refresh()
  }, [])

  return (
    <div className='w-full h-[50vh] flex items-center justify-center text-xl md:text-2xl;'>
      <p className='text-center'>Logged in. Redirecting...</p>
    </div>
  )
}

export default RejectAuthPage
