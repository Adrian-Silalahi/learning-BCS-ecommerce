/* eslint-disable react/prop-types */
'use client'

import React, { useCallback } from 'react'
import { type Product } from '@prisma/client'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { formatRupiah } from '../utils/FormatRupiah'
import Heading from '../components/Heading'
import StockStatus from '../components/StockStatus'
import { MdCached, MdClose, MdDelete, MdDone, MdRemoveRedEye } from 'react-icons/md'
import ActionButton from '../components/Products/ActionButton'
import { useRouter } from 'next/navigation'
import { getStorage } from 'firebase/storage'
import firebaseApp from '../libs/firebase'
import { deleteProduct } from '../utils/DeleteProduct'
import { changeStockStatusInDB } from '../utils/ChangeStockStatusInDB'

interface ManageProductsViewProps {
  products: Product[]
}

const ManageProductsView: React.FC<ManageProductsViewProps> = ({ products }) => {
  const router = useRouter()
  const storage = getStorage(firebaseApp)
  let rows: any = []

  if (products !== null && products !== undefined) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatRupiah(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        imageInfo: product.imageInfo
      }
    })
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'name', headerName: 'Name', width: 220 },
    {
      field: 'price',
      headerName: 'Price(Rp)',
      width: 100,
      renderCell: (params) => {
        const price = params.row.price
        return (
        <div className='font-bold text-slate-800'>{price}</div>
        // ini akan menjadikan sekolom price (kecuali header kolom/ judul kolom) berdasarkan styling diatas
        )
      }
    },
    { field: 'category', headerName: 'Category', width: 100 },
    { field: 'brand', headerName: 'Brand', width: 100 },
    {
      field: 'inStock',
      headerName: 'In Stock',
      width: 120,
      renderCell: (params) => {
        const isStock = params.row.inStock
        return (
        <div>{isStock === true
          ? (
            <StockStatus
              text='in Stock'
              icon={MdDone}
              bg='bg-teal-200'
              color='text-teal-700'/>
            )
          : (
            <StockStatus
              text='out of Stock'
              icon={MdClose}
              bg='bg-rose-200'
              color='text-rose-700'/>
            ) }</div>
        // Di cek dulu pertama stocknya true atau false cara cek nya dengan ambil dari params row/baris
        )
      }
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const id = params.row.id
        const imageInfo = params.row.imageInfo
        const isStock = params.row.inStock

        return (
        <div className='flex justify-between gap-4 w-full'>
         <ActionButton
          icon={MdCached}
          onClick={() => { void handleToggleStock(id, isStock) }}/>
         <ActionButton
          icon={MdDelete}
          onClick={() => { void handleDelete(id, imageInfo) }}/>
         <ActionButton
          icon={MdRemoveRedEye}
          onClick={() => { router.push(`product/${id}`) }}/>
        </div>
        )
      }
    }
  ]

  const handleToggleStock = useCallback(async (id: string, inStock: boolean) => {
    await changeStockStatusInDB({ id, inStock, router })
  }, [])

  const handleDelete = useCallback(async (id: string, imageInfo: any[]) => {
    await deleteProduct({ id, imageInfo, storage, router })
  }, [])

  return (
    <div className='max-w-[1150px] m-auto text-xl'>
      <div className='mb-4 mt-8'>
        <Heading title='Manage Products'/>
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

export default ManageProductsView
