/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React, { useState } from 'react'
import CustomButton from '@/src/components/CustomButton'
import Heading from '@/src/components/Heading'
import Input from '@/src/components/Inputs/input'
import Navigation from '@/src/components/Navigation/navigation'
import axios, { AxiosError } from 'axios'
import { type SignInResponse, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { useCart } from '@/src/hooks/useCart'

const RegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const {setIsLogin} = useCart()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: { name: '', email: '', password: '' }
  })

  const router = useRouter()

  const credentialSignInProcess = async (credentials: FieldValues): Promise<SignInResponse | undefined> => {
    return (
      await signIn('credentials', {
        ...credentials,
        redirect: false
      }))
  }

  const googleSignInProcess = async () => {
    await signIn('google')
    setIsLogin(true)
  }

  const onSubmit: SubmitHandler<FieldValues> = async (userCredentials) => {
    try {
      setIsLoading(true)
      const postCredentials = await axios.post('/api/register', userCredentials)
      if (postCredentials !== null) {
        const signInResolve = await credentialSignInProcess(userCredentials)
        if (signInResolve?.ok === true) {
          router.push('/')
          router.refresh()
          toast.success('Logged In')
        }
        if ((signInResolve?.error) != null) {
          toast.error(signInResolve.error)
        }
      }
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data.message}`)
      }
    } finally {
      setIsLoading(false)
      setIsLogin(true)
    }
  }

  return (
    <>
      <Heading title="Create Your Account" serif className={'pb-2 text-3xl'} />

      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
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
        label={isLoading ? 'Loading...' : 'Sign up'}
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
      />

      <CustomButton outline label="Google" icon={FcGoogle} onClick={() => { googleSignInProcess() }} disabled={isLoading}/>
      <Navigation isLoading={isLoading} path={'/login'} text={'Already have an account?'} >
        <span className="bg-gradient-to-b from-blue-800 to-rose-500 text-transparent bg-clip-text ml-2">
            Login
        </span>
      </Navigation>
    </>
  )
}

export default RegisterForm
