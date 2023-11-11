import FormWrap from '@/src/components/FormWrap'
import React from 'react'
import Image from 'next/image'
import login_img from '@/src/assets/login.jpg'
import LoginForm from './loginForm'
import { getCurrentUser } from '@/src/actions/getCurrentUser'
import RejectAuthPage from '@/src/components/RejectAuthPage'

const Login = async (): Promise<any> => {
  const currentUser = await getCurrentUser()

  if (currentUser !== null && currentUser !== undefined) {
    return <RejectAuthPage/>
  }

  return (
    <div>
      <div className="flex h-screen">
        <div className="flex-1 w-full h-full rounded-xl relative overflow-hidden ">
          <Image
            alt="login-img"
            src={login_img}
            fill
            className="object-cover"
          />
        </div>
        <div className= 'w-[42%]'>
          <div className="flex-1 w-full h-full ">
            <FormWrap>
              <LoginForm />
            </FormWrap>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
