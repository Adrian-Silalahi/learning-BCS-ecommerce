/* eslint-disable react/prop-types */
'use client'

import React from 'react'
import { type Order, type User } from '@prisma/client'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { formatRupiah } from '../utils/FormatRupiah'
import Heading from '../components/Heading'
import Status from '../components/Status'
import { MdAccessTimeFilled, MdDeliveryDining, MdDone, MdRemoveRedEye } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import moment from 'moment'

interface OrdersViewProps {
  orders: ExtendedOrder[]
}

type ExtendedOrder = Order & {
  user: User
}

const OrdersView: React.FC<OrdersViewProps> = ({ orders }) => {
  const router = useRouter()
  let rows: any = []

  if (orders) {
    rows = orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatRupiah(order.amount),
        paymentStatus: order.status,
        date: moment(order.createDate).fromNow(),
        deliveryStatus: order.deliveryStatus
      }
    })
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'customer', headerName: 'Customer Name', width: 130 },
    {
      field: 'amount',
      headerName: 'Amount(Rp)',
      width: 130,
      renderCell: (params) => {
        const amount = params.row.amount
        return (
        <div className='font-bold text-slate-800'>{amount}</div>
        )
      }
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      width: 130,
      renderCell: (params) => {
        const paymentStatus = params.row.paymentStatus
        return (
        <div>{paymentStatus === 'pending'
          ? (
            <Status
              text='pending'
              icon={MdAccessTimeFilled}
              bg='bg-slate-200'
              color='text-slate-700'/>
            )
          : paymentStatus === 'complete'
            ? (
            <Status
              text='completed'
              icon={MdDone}
              bg='bg-green-200'
              color='text-green-700'/>
              )
            : (<></>)
          }</div>
        )
      }
    },
    {
      field: 'deliveryStatus',
      headerName: 'Delivery Status',
      width: 130,
      renderCell: (params) => {
        const deliveryStatus = params.row.deliveryStatus
        return (
        <div>{deliveryStatus === 'pending'
          ? (
            <Status
              text='pending'
              icon={MdAccessTimeFilled}
              bg='bg-slate-200'
              color='text-slate-700'/>
            )
          : deliveryStatus === 'dispatched'
            ? (
            <Status
              text='dispatched'
              icon={MdDeliveryDining}
              bg='bg-purple-200'
              color='text-purple-700'/>
              )
            : deliveryStatus === 'delivered'
              ? (
            <Status
              text='delivered'
              icon={MdDone}
              bg='bg-green-200'
              color='text-green-700'/>
                )
              : (<></>)
          }</div>
        )
      }
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 130
    },
      ]

  return (
    <div className='max-w-[950px] m-auto text-xl'>
      <div className='mb-4 mt-8'>
        <Heading title=' Orders'/>
      </div>
      <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
  pageSizeOptions={[5, 10]} 
  disableRowSelectionOnClick 
/>
      </div>
    </div>
  )
}

export default OrdersView
