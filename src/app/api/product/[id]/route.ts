import { getCurrentUser } from '@/src/actions/getCurrentUser'
import { NextResponse } from 'next/server'

export async function DELETE (request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (currentUser === null || currentUser === undefined || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const product = await prisma?.product.delete({
    where: {
      id: params.id
    }
  })

  return NextResponse.json(product)
}
