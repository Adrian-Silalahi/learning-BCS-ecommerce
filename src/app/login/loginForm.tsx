/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
'use client'

import React, { useState } from 'react'
import CustomButton from '@/src/components/CustomButton'
import Heading from '@/src/components/Heading'
import Input from '@/src/components/Inputs/input'
import { type SignInResponse, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'
import Navigation from '@/src/components/Navigation/navigation'
import { useCart } from '@/src/hooks/useCart'

const LoginForm: React.FC = () => {
  const router = useRouter()
  const {setIsLogin} = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = async (userCredentials) => {
    try {
      setIsLoading(true)
      const signInProcess = async (credentials: FieldValues): Promise<SignInResponse | undefined> => {
        return (
          await signIn('credentials', {
            ...credentials,
            redirect: false
          })
        )
      }
      const signInPromise = await signInProcess(userCredentials)
      if (signInPromise?.ok === true) {
        router.push('/')
        toast.success('Logged In')
      }
      if ((signInPromise?.error) != null) {
        toast.error(signInPromise.error)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
      setIsLogin(true)
      router.refresh()
    }
  }

  return (
    <>
      <Heading
        title="Welcome To Bodat Chic"
        serif
        className={'pb-2 text-3xl'}
      />

      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="email"
      />
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <CustomButton
        label={isLoading ? 'Loading...' : 'Login'}
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
      />

      <CustomButton outline label="Google" icon={FcGoogle} onClick={() => { void signIn('google') }} disabled={isLoading}/>
      <Navigation isLoading={isLoading} path={'/register'} text={"don't have an account yet"} >
        <span className="bg-gradient-to-b from-blue-800 to-rose-500 text-transparent bg-clip-text ml-2">
            register
        </span>
      </Navigation>
    </>
  )
}

export default LoginForm
