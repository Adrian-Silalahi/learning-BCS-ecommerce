import React from 'react'

const Custom404 = (): React.JSX.Element => {
  return (
    <div className="flex flex-col h-[100vh] items-center">
      <img src="/error.png" alt="404Image" className="h-[50%]" />
      <div className="text-lg text-purple-500">
        <span className="text-black font-semibold">404 Error</span>{' '}
        <span className="font-light text-black">|</span> Halaman Tidak Ditemukan
      </div>
    </div>
  )
}

export default Custom404
