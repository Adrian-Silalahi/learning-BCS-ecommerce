import prisma from '@/src/libs/prismadb'

interface getOrderByIdProps {
  orderId?: string
}

export default async function getOrderById (params: getOrderByIdProps): Promise<any> {
  try {
    const { orderId } = params
    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      }
    })

    if (!order) return null
    return order
  } catch (error: any) {
    throw new Error(error)
  }
}
