import Image from 'next/image'
import React from 'react'
import BannerPic from '@/src/assets/Banner_pic.png'

const HomeBanner = (): React.ReactElement => {
  return (
    <div className="relative bg-gradient-to-r from-sky-500 to-sky-700 md:to-red-700 lg:to-yellow-700 xl:to-green-700 my-8 ">
      <div className="mx-auto px-8 py-12 flex flex-col gap-2 md:flex-row items-center justify-evenly">
        <div className="mb-8 md:mb-0 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Summer Sale</h1>
          <p className="text-lg md:text-xl text-white mb-2">Enjoy discount on selected items</p>
          <p className="text-2xl md:text-5xl text-yellow-400 font-bold">GET 50% OFF</p>
        </div>
        <div className="w-2/3 md:w-1/3 relative aspect-video bg-slate-200">
          <Image src={BannerPic} alt="banner_pic" className="object-contain" fill />
        </div>
      </div>
    </div>
  )
}

export default HomeBanner
