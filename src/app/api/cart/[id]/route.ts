import { getCurrentUser } from '@/src/actions/getCurrentUser'
import { NextResponse } from 'next/server'

export async function DELETE (request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const currentUser = await getCurrentUser()
  const isInvalidUser = (!currentUser || currentUser.role !== 'ADMIN')

  if (isInvalidUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try{
    const cartProduct = await prisma?.cartProduct.delete({
      where: {
        id: params.id,
        userId: currentUser.id,
      }
    })
  
    return NextResponse.json(cartProduct)
  }
  catch(error: any){
    return NextResponse.json({ error }, { status: 500 })
  }
}
