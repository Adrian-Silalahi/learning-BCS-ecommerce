'use client'
import React from 'react'
import { type UseFormRegister, type FieldValues, type FieldErrors } from 'react-hook-form'

interface InputProps {
  id: string
  label: string
  type?: string
  disabled?: boolean
  required?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
}
const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  disabled,
  required,
  register,
  errors
}) => {
  const isError = (errors[id] !== null && errors[id] !== undefined) && errors
  return (
    <div className="w-full relative">
      <input
        // autoComplete: "off": Ini akan menonaktifkan pengisian otomatis sepenuhnya. Data sejarah pengetikan sebelumnya tidak akan digunakan atau ditawarkan.
        autoComplete="off"
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        // id bukan berasal dari react-form-hook namun dari props yang di import
        // baca penjelasannya di notepad materi react terkait penggunaan react-form-hook

        placeholder=""
        type={type}
        className={`
        peer w-full p-3 pt-6 pl-4 outline-none bg-white font-light border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed invalid:ring-1 invalid:ring-rose-500 invalid:border-none invalid:text-rose-500
        ${isError ? 'border-rose-400' : 'border-slate-300'}
        ${isError ? 'focus:border-rose-400' : 'border-slate-600'}`}
      />
      <label
        htmlFor={id}
        // placeholder-shown: artinya adalah style yang muncul saat placeholder ditampilkan
        // Ketika sebuah input sudah berisikan sebuah value, berarti dia tidak termasuk lagi ke dalam placeholder-shown
        className={`absolute 
        cursor-text text-sm duration-150 -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-80 peer-placeholder-shown:translate-y-1 peer-focus:-translate-y-4 peer-focus:scale-75
        ${isError ? 'text-rose-500' : 'text-slate-400'}`}
      >
        {label}
      </label>
    </div>
  )
}

export default Input
