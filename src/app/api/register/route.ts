import prisma from '@/src/libs/prismadb'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

export async function POST (request: Request): Promise<NextResponse> {
  const body = await request.json()
  const { name, email, password } = body

  const checkName = await prisma.user.findUnique({
    where: {
      name
    }
  })

  if (checkName) {
    return NextResponse.json(
      { message: 'Nama ini sudah terdaftar' },
      { status: 409 }
    )
  }

  const checkEmail = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (checkEmail) {
    return NextResponse.json(
      { message: 'Email ini sudah terdaftar' },
      { status: 409 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword
    }
  })

  return NextResponse.json(user)
}
