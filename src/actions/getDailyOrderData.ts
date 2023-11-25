import moment from 'moment'
import prisma from '../libs/prismadb'


export default async function getDailyOrderData () {
  try {
    const startDate = moment().subtract(6, 'days').startOf('day')
    const endDate = moment().endOf('day')
    const completeOrdersInfo = await prisma.order.groupBy({
      by: ['createDate'],
      where: {
        createDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString()
        },
        status: 'complete'
      },
      _sum: {
        amount: true
      }
    })

        const dailyOrderData: {
            [day: string] : {
                day: string
                date: string
                totalAmount: number
        }
    } = {}

    const initialDate = startDate.clone()

    while (initialDate <= endDate) {
      const day = initialDate.format('dddd')

      dailyOrderData[day] = {
        day: day,
        date: initialDate.format('YYYY-MM-DD'),
        totalAmount: 0
      }

      initialDate.add(1, 'day')
    }

    completeOrdersInfo?.forEach((order) => {
      const day = moment(order.createDate).format('dddd')
      const amount = order._sum.amount || 0
      dailyOrderData[day].totalAmount += amount
    })

    const endDailyOrderData = Object.values(dailyOrderData).sort((a, b) => moment(a.date).diff(moment(b.date))
    )

    return endDailyOrderData
  } catch (error: any) {
    throw new Error(error)
  }
}
