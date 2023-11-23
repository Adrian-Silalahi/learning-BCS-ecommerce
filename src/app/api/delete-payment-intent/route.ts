import { getCurrentUser } from '@/src/actions/getCurrentUser';
import prisma from '@/src/libs/prismadb';
import { NextResponse } from 'next/server';

export async function DELETE (request: Request): Promise<NextResponse> {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    console.log('currentUser', currentUser);
    
    const userId = currentUser.id
    await prisma?.user.update({
      where: {
        id: userId
      },
      data: {
        paymentIntentId: null
      }
    })
    return NextResponse.json({ message: 'Delete intent from database success!' }, { status: 200 })
  }
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
}
