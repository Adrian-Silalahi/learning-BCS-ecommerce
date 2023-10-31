import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcrypt'
import NextAuth, { type AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import prisma from '../../../libs/prismadb'

export const authOptions: AuthOptions = {
  // adapter yang digunakan untuk menghubungkan aplikasi next-auth dengan Prisma
  adapter: PrismaAdapter(prisma),
  providers: [
    // Dengan menggunakan Google Provider, pengguna dapat masuk ke aplikasi dengan menggunakan akun Google mereka.
    GoogleProvider({
      // as string dibuat karena GoogleProvider mengharapkan clientId dan clientSecret sebagai string
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    // Credentials adalah informasi yang digunakan untuk autentikasi (mengidentifikasi) pengguna. seperti email,password ini semua dinamakan credentials
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'email',
          placeholder: 'email', // label&placeholder ini hanya ditampilkan pada login page default  yang disediakan oleh next-auth. Cara agar login page yang dipakai adalah milik kita sendiri, kita harus mendefinisikan field pages: {signIn: '/login'} (Lihat codenya di bagian bawah). Jadi ketika kita ingin memakai login page punya kita sendiri, sebenarnya kita boleh hanya memakai field type-nya saja, tanpa perlu mengubah field label dan placeholder.
          type: 'email'
        },
        password: {
          label: 'email',
          type: 'password'
        }
      },

      async authorize (credentials) {
        // Pertama, ini memeriksa apakah kredensial yang diterima lengkap (email & password). Jika tidak, kembalikan pesan kesalahan
        const invalidEmail = (credentials?.email) == null
        const invalidPassword = (credentials?.password) == null
        if (invalidEmail || invalidPassword) {
          throw new Error('Invalid email or password')
        }

        // Kedua, ini memeriksa apakah pengguna dengan email yang diberikan ada di database. Jika tidak, kembalikan pesan kesalahan
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        // Ketiga, kita cek pengguna ada atau tidak. Jika tidak ada, variabel user akan null Ini adalah kondisi ketika pengguna dengan email yang diberikan tidak ditemukan.
        // lalu, pada "!user?" di cek lagi apakah user ada atau tidak, jika tdk ada kembalikan pesan kesalahan dan kalau ada diambil property "hashedPassword" dan di cek ada atau tidak properti ini? kalau tidak ada kembalikan pesan kesalahan
        if (user?.hashedPassword == null) {
          throw new Error('Invalid email or password')
        }

        // Keempat, jika pengguna ditemukan dan kata sandi yang di-hash tersedia, lalu menggunakan bcrypt untuk membandingkan kata sandi yang diberikan user dengan kata sandi yang di-hash dalam database. Menggunakan sistem  bcrypt, sistem bcrypt membandingkan kata sandi yang diberikan user dengan kata sandi yang di-hash dalam database.Jika kata sandi cocok, itu berarti pengguna telah memberikan kredensial yang benar
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        // Kelima, jika kata sandi tidak cocok, kembalikan pesan kesalahan
        if (!isCorrectPassword) {
          throw new Error('Invalid email or password')
        }

        // Keenam, Jika kredensial sudah valid, fungsi akan mengembalikan objek user yang diautentikasi. user ini dapat digunakan dalam proses selanjutnya untuk memberikan izin atau akses tertentu kepada pengguna yang diautentikasi.
        return user
      }
    })
  ],
  pages: {
    signIn: '/login'
  },

  // Saat debug : true dan Saat aplikasi dalam mode "development", Anda akan melihat informasi tambahan yang membantu Anda melacak masalah, seperti pesan kesalahan lebih rinci, catatan kegiatan otentikasi, dan lain sebagainya. Ini sangat berguna saat Anda sedang mengembangkan dan memecahkan masalah.
  // Cth: [DEBUG] Authentication Process - Step 3: User successfully authenticated. dan lain-lain
  debug: process.env.NODE_ENV === 'development',

  //
  session: {
    strategy: 'jwt'
  },
  // secret key
  secret: process.env.NEXTAUTH_SECRET
}

// Parameter ini adalah required
export default NextAuth(authOptions)
