import FormWrap from '@/src/components/FormWrap'
import React from 'react'
import Image from 'next/image'
import login_img from '@/src/assets/login.jpg'
import LoginForm from './loginForm'
import { getCurrentUser } from '@/src/actions/getCurrentUser'

const Register = async (): Promise<React.JSX.Element> => {
  const currentUser = await getCurrentUser()
  const emptyUser = !currentUser


  return (
    <div>
      <div className="flex h-screen">
        {emptyUser && (
        <div className="flex-1 w-full h-full rounded-xl relative overflow-hidden ">
          <Image
            alt="login-img"
            src={login_img}
            fill
            className="object-cover"
          />
        </div>)}
        <div className={`${currentUser? "w-full" : "w-[42%]"}`}>
          <div className="flex-1 w-full h-full ">
            <FormWrap>
              <LoginForm currentUser={currentUser}/>
            </FormWrap>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
