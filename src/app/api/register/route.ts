import prisma from '@/src/libs/prismadb'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

// Membuat sebuah fungsi untuk create akun user
export async function POST (request: Request): Promise<NextResponse> {
  const body = await request.json()
  const { name, email, password } = body

  // jika true: name sudah terdaftar di database
  const checkName = await prisma.user.findUnique({
    where: {
      name
    }
  })

  if (checkName) {
    return NextResponse.json(
      // Jika name sudah pernah terdaftar, kembalikan pesan kesalahan
      { message: 'Nama ini sudah terdaftar' },
      { status: 409 }
    )
  }

  // jika true: email sudah terdaftar di database
  const checkEmail = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (checkEmail) {
    return NextResponse.json(
      // Jika email sudah pernah terdaftar, kembalikan pesan kesalahan
      { message: 'Email ini sudah terdaftar' },
      { status: 409 }
    )
  }

  // Membuat hash password
  // angka 10 di parameter artinya semakin tinggi angka maka semakin kompleks hash password kita dan semakin sulit untuk diketahui orang lain, namun semakin tinggi juga akan membuat prosesnya semakin lama, maka best practicenya ada di rentang 10 - 12
  const hashedPassword = await bcrypt.hash(password, 10)

  // Prisma memasukkan data akun user ke dalam database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword
    }
  })

  // Mengembalikan data user yang telah ditambahkan ke dalam database
  return NextResponse.json(user)
}
