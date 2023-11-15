import FormWrap from '@/src/components/FormWrap'
import React from 'react'
import RegisterForm from '@/src/app/register/registerForm'
import Image from 'next/image'
import register_img from '@/src/assets/register.jpg'
import { getCurrentUser } from '@/src/actions/getCurrentUser'
import RejectAuthPage from '@/src/components/RejectAuthPage'

const Register = async (): Promise<React.ReactElement> => {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    return <RejectAuthPage/>
  }

  return (
    <div>
      <div className="flex h-screen">
          <div className="flex-1 w-full h-full rounded-e-xl relative overflow-hidden ">
          <Image
            alt="register-img"
            src={register_img}
            fill
            className="object-cover"
          />
        </div>
        {/* Pemberian m-auto pada elemen flex items / elemen yg parentnya memiliki d-flex akan membuat flex-items tsb berada di tengah */}
        <div className="w-[42%]">
          <FormWrap>
            <RegisterForm />
          </FormWrap>
        </div>
      </div>
    </div>
  )
}

export default Register
