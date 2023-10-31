import React from 'react'

const FormWrap = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    // min-h-fit: membuat elemen dinamis mengikuti ukuran kontennya / elemen child-nya tanpa perlu menentukan tinggi secara eksplisit.
    <div className="min-h-fit h-full flex items-center justify-center ">
      <div className="max-w-[500px] w-full flex flex-col gap-5 border-2 items-center shadow-xl shadow-slate-200 rounded-md p-4 md:px-8 md:py-4">
        {children}
      </div>
    </div>
  )
}

export default FormWrap
