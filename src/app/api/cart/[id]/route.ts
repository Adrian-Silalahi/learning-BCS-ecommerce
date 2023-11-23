import { getCurrentUser } from '@/src/actions/getCurrentUser'
import { NextResponse } from 'next/server'

export async function DELETE (request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try{
    console.log('paramsId', params.id)
    console.log('currentUser', currentUser)
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
