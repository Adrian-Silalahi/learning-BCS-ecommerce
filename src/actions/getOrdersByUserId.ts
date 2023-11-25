import prisma from '../libs/prismadb'

export default async function getOrdersByUserId (userId: string): Promise<any> {
  try {
    const orders = await prisma.order.findMany({
      // include: {
      //   user: true
      // },
      orderBy: {
        createDate: 'desc'
      },
      where: {
        userId
      }
    })

    return orders
  } catch (error: any) {
    console.log(error)
    throw error
  }
}
