'use client'

import { type Order, type Product, type User } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import Heading from '../components/Heading'
import { formatRupiah } from '../utils/FormatRupiah'

interface SummaryViewsProps {
  orders: Order[]
  products: Product[]
  users: User[]
}

type SummaryDataType = {
  [key : string]: {
    label : string
    digit: number
  }
}

const SummaryViews: React.FC<SummaryViewsProps> = ({ orders, products, users }) => {
  const [summaryData, setSummaryData] = useState<SummaryDataType>({
    sale: {
      label: 'Total Sale',
      digit: 0
    },
    products: {
      label: 'Total Products',
      digit: 0
    },
    orders: {
      label: 'Total Orders',
      digit: 0
    },
    paidOrders: {
      label: 'Paid Orders',
      digit: 0
    },
    unpaidOrders: {
      label: 'Unpaid Orders',
      digit: 0
    },
    users: {
      label: 'Total Users',
      digit: 0
    }
  })

  useEffect(() => {
    setSummaryData((prev) => {
      let temporarySummaryData = { ...prev }

      const totalSale = orders.reduce((acc, order) => {
        if (order.status === 'complete') {
          return acc + order.amount
        } else return acc
      }, 0)

      const paidOrders = orders.filter((order) => {
        return order.status === 'complete'
      })

      const unpaidOrders = orders.filter((order) => {
        return order.status === 'pending'
      })

      temporarySummaryData.sale.digit = totalSale
      temporarySummaryData.orders.digit = orders.length
      temporarySummaryData.paidOrders.digit = paidOrders.length
      temporarySummaryData.unpaidOrders.digit = unpaidOrders.length
      temporarySummaryData.products.digit = products.length
      temporarySummaryData.users.digit = users.length

      return temporarySummaryData
    })
  }, [orders, products, users])

  const summaryKeys = Object.keys(summaryData)

  return (
    <div className='max-w-[950px] mx-auto'>
      <div className='mb-4 mt-1'>
        <Heading title='Stats' center />
      </div>
      <div className='grid grid-cols-2 gap-3 h-[70vh] overflow-y-auto mb-4'>
        {
          summaryKeys && summaryKeys.map((key) => {
            return <div key={key} className='rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition'>
              <div className='text-xl md:text-4xl font-bold'>
                  {summaryData[key].label === 'Total Sale' ? 
                  <>
                    {formatRupiah(summaryData[key].digit)}
                  </> 
                  :
                  <>
                    {summaryData[key].digit}
                  </>
                  }
              </div>
              <div>{summaryData[key].label}</div>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default SummaryViews