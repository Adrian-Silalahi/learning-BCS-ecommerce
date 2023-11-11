import prisma from '../libs/prismadb'

export default async function getOrders (): Promise<any> {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true
      },
      orderBy: {
        createDate: 'desc'
      }
    })

    return orders
  } catch (error: any) {
    console.log(error)
    throw error
  }
}
