/* eslint-disable react/prop-types */
'use client'

import React, { useCallback } from 'react'
import { type Order, type User } from '@prisma/client'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { formatRupiah } from '../utils/FormatRupiah'
import Heading from '../components/Heading'
import StockStatus from '../components/StockStatus'
import { MdAccessTimeFilled, MdDeliveryDining, MdDone, MdRemoveRedEye } from 'react-icons/md'
import ActionButton from '../components/Products/ActionButton'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import axios from 'axios'
import toast from 'react-hot-toast'

interface ManageOrdersViewProps {
  orders: ExtendedOrder[]
}

type ExtendedOrder = Order & {
  user: User
}

const ManageOrdersView: React.FC<ManageOrdersViewProps> = ({ orders }) => {
  const router = useRouter()
  let rows: any = []

  if (orders !== null && orders !== undefined) {
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
        // ini akan menjadikan sekolom amount (kecuali header kolom/ judul kolom) berdasarkan styling diatas
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
            <StockStatus
              text='pending'
              icon={MdAccessTimeFilled}
              bg='bg-slate-200'
              color='text-slate-700'/>
            )
          : paymentStatus === 'complete'
            ? (
            <StockStatus
              text='completed'
              icon={MdDone}
              bg='bg-green-200'
              color='text-green-700'/>
              )
            : (<></>)
          }</div>
        // Di cek dulu pertama stocknya true atau false cara cek nya dengan ambil dari params row/baris
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
            <StockStatus
              text='pending'
              icon={MdAccessTimeFilled}
              bg='bg-slate-200'
              color='text-slate-700'/>
            )
          : deliveryStatus === 'dispatched'
            ? (
            <StockStatus
              text='dispatched'
              icon={MdDeliveryDining}
              bg='bg-purple-200'
              color='text-purple-700'/>
              )
            : deliveryStatus === 'delivered'
              ? (
            <StockStatus
              text='delivered'
              icon={MdDone}
              bg='bg-green-200'
              color='text-green-700'/>
                )
              : (<></>)
          }</div>
        // Di cek dulu pertama stocknya true atau false cara cek nya dengan ambil dari params row/baris
        )
      }
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 130
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const id = params.row.id
        return (
        <div className='flex justify-between gap-4 w-full'>
         <ActionButton
          icon={MdDeliveryDining}
          onClick={() => { handleDispatch(id) }}/>
         <ActionButton
          icon={MdDone}
          onClick={() => { handleDeliver(id) }}/>
         <ActionButton
          icon={MdRemoveRedEye}
          onClick={() => { router.push(`order/${id}`) }}/>
        </div>
        )
      }
    }
  ]

  const handleDispatch = useCallback((id: string) => {
    axios.put('/api/order', {
      id,
      deliveryStatus: 'dispatched'
    }).then((response) => {
      toast.success('Order Dispatched')
      router.refresh()
    }).catch((error) => {
      toast.error('Oops! Something went wrong')
      console.log(error)
    })
  }, [])

  const handleDeliver = useCallback((id: string) => {
    axios.put('/api/order', {
      id,
      deliveryStatus: 'delivered'
    }).then((response) => {
      toast.success('Order Delivered')
      router.refresh()
    }).catch((error) => {
      toast.error('Oops! Something went wrong')
      console.log(error)
    })
  }, [])

  return (
    <div className='max-w-[1150px] m-auto text-xl'>
      <div className='mb-4 mt-8'>
        <Heading title='Manage Orders'/>
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
  pageSizeOptions={[5, 10]} // Mengatur ukuran tabel
  checkboxSelection // Jika true, maka memunculkan checkbox di bagian awal row
  disableRowSelectionOnClick // Tidak mengaktifkan checkbox saat salah satu tombol di bagian row di tekan
/>
      </div>
    </div>
  )
}

export default ManageOrdersView
