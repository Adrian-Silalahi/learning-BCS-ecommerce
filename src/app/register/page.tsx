import FormWrap from '@/src/components/FormWrap'
import React from 'react'
import RegisterForm from '@/src/app/register/registerForm'
import Image from 'next/image'
import register_img from '@/src/assets/register.jpg'
import { getCurrentUser } from '@/src/actions/getCurrentUser'

const Register = async (): Promise<React.ReactElement> => {
  const currentUser = await getCurrentUser()
  const emptyUser = !currentUser

  return (
    <div>
      <div className="flex h-screen">
        {emptyUser && (
          <div className="flex-1 w-full h-full rounded-xl relative overflow-hidden ">
          <Image
            alt="register-img"
            src={register_img}
            fill
            className="object-cover"
          />
        </div>
        )}
        {/* Pemberian m-auto pada elemen flex items / elemen yg parentnya memiliki d-flex akan membuat flex-items tsb berada di tengah */}
        <div className={`${currentUser? "w-full" : "w-[42%]" }`}>
          <FormWrap>
            <RegisterForm currentUser={currentUser} />
          </FormWrap>
        </div>
      </div>
    </div>
  )
}

export default Register
