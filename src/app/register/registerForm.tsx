'use client'

import CustomButton from '@/src/components/CustomButton'
import Heading from '@/src/components/Heading'
import Input from '@/src/components/Inputs/input'
import Navigation from '@/src/components/Navigation/navigation'
import { SafeUser } from '@/src/types'
import axios, { AxiosError } from 'axios'
import { type SignInResponse, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'

interface RegisterFormProps {
  currentUser: SafeUser | null
}
const RegisterForm: React.FC<RegisterFormProps> = ({currentUser}) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: { name: '', email: '', password: '' }
  })

  const router = useRouter()

  useEffect(() => {
    if (currentUser) {
      router.push('/')
      router.refresh()
    }
  }, [])

  const onSubmit: SubmitHandler<FieldValues> = async (userCredentials) => {
    // userCredentials berasal dari inputan yg di isi oleh user dan ditangani oleh react-hook-form dan data credentialsnya dikirimkan ke props fungsi onSubmit. Kita juga bisa mengatur nilai default dari credentials di bagian defaultValues dari useForm (lihat letaknya ada dibawah initialisasi state)
    try {
      setIsLoading(true)
      const postCredentials = await axios.post('/api/register', userCredentials)
      // Sebuah fungsi untuk proses signIn
      const signInProcess = async (credentials: FieldValues): Promise<SignInResponse | undefined> => {
        return (
          // - Credentials adalah informasi yang digunakan untuk autentikasi (mengidentifikasi) pengguna. seperti email,password ini semua dinamakan credentials
          // - fungsi signIn dibawah adalah fungsi yang dibuat oleh next-auth. Cara kerja nya adalah data-data yang dimasukkan(EMAIL&PASSWORD) akan digunakan sebagai credentials untuk autentikasi/pengecekan data user dan mencocokkannya dengan data yang ada di database(proses mencocokkan ini ada di src\pages\api\auth\[...nextauth].ts)
          // - signIn adalah proses autentikasi user, mengapa dilakukan di register page bukannya autentikasi dilakukan di login? jawabannya adalah memang autentikasi dilakukan di login page yaitu dengan mencocokkan data yang diberikan user dengan data yang ada di database.Biasanya, setelah kita melakukan registrasi maka user akan langsung masuk ke halaman login. Namun di aplikasi kita ini, setelah user selesai melakukan registrasi, data user tersebut akan segera di autentikasi agar user tidak perlu repot-repot lagi mengisi form login, toh setelah registrasi akun, user pasti akan melakukan login ke dalam aplikasi. Oleh karena itu kita langsung saja autentikasi dengan menggunakan fungsi signIn yang disediakan oleh next-auth.
          await signIn('credentials', {
            ...credentials,
            // kalau redirect bernilai false, maka user tidak akan diarahkan / di routing kemana-mana, alias tetap dihalaman itu saja. agar pesan-pesan yang kita kirimkan seperti pesan success buat akun, maupun pesan kesalahan seperti password salah!, ditampilkan tetap dihalaman itu saja (tergantung user berada di halaman login atau register).Kan jelek dilihat ketika password masih namun user berada di halaman home misalnya.
            redirect: false
          }))
      }
      if (postCredentials !== null) {
        // signInResolve akan menangkap resolve dari signInProcess
        const signInResolve = await signInProcess(userCredentials)
        // jika sign in sucess maka signInResolve.ok bernilai true
        if (signInResolve?.ok === true) {
          router.push('/')
          router.refresh()
          toast.success('Logged In')
        }
        if ((signInResolve?.error) != null) {
          toast.error(signInResolve.error)
        }
      }
    // catch akan menangkap reject atau kalau di fetch api dia akan masuk ke catch kalau statusnya bernilai 400 keatas (ERROR)
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data.message}`)
      }
    // Akan selalu dijalankan apapun promise yang dikembalikan (mau itu resolve atau reject)
    } finally {
      setIsLoading(false)
    }
  }

  if (currentUser) {
    return <p className='text-center'>Logged in. Redirecting...</p>
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

      <CustomButton outline label="Google" icon={FcGoogle} onClick={() => {signIn('google')}} disabled={isLoading}/>
      <Navigation isLoading={isLoading} path={'/login'} text={'Already have an account?'} >
        <span className="bg-gradient-to-b from-blue-800 to-rose-500 text-transparent bg-clip-text ml-2">
            Login
        </span>
      </Navigation>
    </>
  )
}

export default RegisterForm
