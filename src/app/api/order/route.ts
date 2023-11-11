import { getCurrentUser } from '@/src/actions/getCurrentUser'
import prisma from '@/src/libs/prismadb'
import { NextResponse } from 'next/server'

export async function PUT (request: Request): Promise<NextResponse> {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (currentUser === null || currentUser === undefined || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return NextResponse.json({ Error: 'User is not valid!' }, { status: 401 })
  }

  const body = await request.json()
  const { id, deliveryStatus } = body

  const order = await prisma.order.update({
    where: {
      id
    },
    data: {
      deliveryStatus
    }
  })
  return NextResponse.json(order)
}
