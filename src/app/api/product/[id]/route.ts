import prisma from '@/src/libs/prismadb'
import { NextResponse } from 'next/server'


export async function DELETE (request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const product = await prisma.product.delete({
    where: {
      id: params.id
    }
  })

  return NextResponse.json(product)
}

export async function GET (request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const product = await prisma.product.findFirst({
    where: {
      id: params.id
    }
  })

  return NextResponse.json(product?.stock)
}
