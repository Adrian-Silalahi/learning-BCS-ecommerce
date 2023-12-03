/* eslint-disable react/prop-types */
'use client'

import React, { useCallback } from 'react'
import { type Product } from '@prisma/client'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { formatRupiah } from '../utils/FormatRupiah'
import Heading from '../components/Heading'
import Status from '../components/Status'
import { MdClose, MdDelete, MdDone, MdRemoveRedEye } from 'react-icons/md'
import ActionButton from '../components/Products/ActionButton'
import { useRouter } from 'next/navigation'
import { getStorage } from 'firebase/storage'
import firebaseApp from '../libs/firebase'
import { deleteProduct } from '../utils/DeleteProduct'

interface ManageProductsViewProps {
  products: Product[]
}

const ManageProductsView: React.FC<ManageProductsViewProps> = ({ products }) => {
  const router = useRouter()
  const storage = getStorage(firebaseApp)
  let rows: any = []

  if (products) {
    rows = products.map((product) => {
      console.log('stock',product.stock);
      
      return {
        id: product.id,
        name: product.name,
        price: formatRupiah(product.price),
        category: product.category,
        brand: product.brand,
        stock: product.stock,
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
        )
      }
    },
    { field: 'category', headerName: 'Category', width: 100 },
    { field: 'brand', headerName: 'Brand', width: 100 },
    {
      field: 'Stock',
      headerName: 'Stock',
      width: 120,
      renderCell: (params) => {
        const productStock = params.row.stock
        return (
        <div>{productStock > 0
          ? (
            <Status
              text= {productStock}
              icon={MdDone}
              bg='bg-teal-200'
              color='text-teal-700'/>
            )
          : (
            <Status
              text='out of Stock'
              icon={MdClose}
              bg='bg-rose-200'
              color='text-rose-700'/>
            ) }</div>
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
        return (
        <div className='flex justify-normal gap-4 w-full'>
         <ActionButton
          icon={MdDelete}
          onClick={() => { void handleDelete(id, imageInfo) }}/>
         <ActionButton
          icon={MdRemoveRedEye}
          onClick={() => { router.push(`/productDetail/${id}`) }}/>
        </div>
        )
      }
    }
  ]

  const handleDelete = useCallback(async (id: string, imageInfo: any[]) => {
    await deleteProduct({ id, imageInfo, storage, router })
  }, [])

  return (
    <div className='max-w-[1000px] m-auto text-xl'>
      <div className='mb-4 mt-8'>
        <Heading title='Manage Products'/>
      </div>
      <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 9 }
          }
        }}
  pageSizeOptions={[5, 10]} 
  disableRowSelectionOnClick 
/>
      </div>
    </div>
  )
}

export default ManageProductsView
