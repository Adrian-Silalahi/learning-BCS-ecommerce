'use client'

import CustomButton from '@/src/components/CustomButton'
import Heading from '@/src/components/Heading'
import Input from '@/src/components/Inputs/input'
import { type SignInResponse, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'
import Navigation from '@/src/components/Navigation/navigation'
import { SafeUser } from '@/src/types'

interface LoginFormProps {
  currentUser: SafeUser
}

const LoginForm: React.FC<LoginFormProps> = ({currentUser}) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register, // validasi register dari library react-form-hook
    handleSubmit, // validasi handleSubmit dari library react-form-hook
    formState: { errors }// errors akan menangani jika form tidak valid seperti pengisian credential yang tidak lengkap dan lain-lain
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    if (currentUser) {
      router.push('/')
      router.refresh()
    }
  }, [])


  const router = useRouter()

  const onSubmit: SubmitHandler<FieldValues> = async (userCredentials) => {
    // Penjelasan dari properti/fungsi-fungsi yang berasal dari react-hook-form ada di file registerForm.tsx
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
        router.refresh()
        toast.success('Logged In')
      }
      if ((signInPromise?.error) != null) {
        toast.error(signInPromise.error)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (currentUser) {
    return <p className='text-center'>Logged in. Redirecting...</p>
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

      <CustomButton outline label="Google" icon={FcGoogle} onClick={() => {signIn('google')}} disabled={isLoading}/>
      <Navigation isLoading={isLoading} path={'/register'} text={"don't have an account yet"} >
        <span className="bg-gradient-to-b from-blue-800 to-rose-500 text-transparent bg-clip-text ml-2">
            register
        </span>
      </Navigation>
    </>
  )
}

export default LoginForm
