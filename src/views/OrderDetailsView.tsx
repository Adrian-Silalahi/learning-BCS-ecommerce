'use client'

import { type Order } from '@prisma/client'
import React from 'react'
import Heading from '../components/Heading'
import { formatRupiah } from '../utils/FormatRupiah'
import { MdAccessTimeFilled, MdDeliveryDining, MdDone } from 'react-icons/md'
import Status from '../components/Status'
import moment from 'moment'
import OrderItem from '../app/order/orderItem'

interface OrderDetailsViewProps {
  order: Order
}

const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({ order }) => {
  return (
    <div className='max-w-[1150px] mx-auto flex flex-col gap-2'>
      <div className='mt-8'>
        <Heading title='Order Details' />
      </div>
      <div>Order ID: {order.id}</div>
      <div>
        Total Amunt: {' '}
        <span className='font-bold'>{formatRupiah(order.amount)}</span>
      </div>
      <div className='flex gap-2 items-center'>
        <div>Payment status:</div>
        <div>
          {order.status === 'pending'
            ? (<Status
          text='pending'
          icon={MdAccessTimeFilled}
          bg='bg-slate-200'
          color='text-slate-700'
          />)
            : order.status === 'complete'
              ? (<Status
            text='completed'
            icon={MdDone}
            bg='bg-green-200'
            color='text-green-700'
            />)
              : (
              <></>
                )
          }
        </div>
      </div>
      <div className='flex gap-2 items-center'>
        <div>Delivery status:</div>
        <div>
          {order.deliveryStatus === 'pending'
            ? (<Status
          text='pending'
          icon={MdAccessTimeFilled}
          bg='bg-slate-200'
          color='text-slate-700'
          />)
            : order.deliveryStatus === 'dispatch'
              ? (<Status
            text='dispatched'
            icon={MdDeliveryDining}
            bg='bg-purple-200'
            color='text-purple-700'
            />)
              : order.deliveryStatus === 'delivered'
                ? (<Status
              text='delivered'
              icon={MdDone}
              bg='bg-green-200'
              color='text-green-700'
            />)
                : (
              <></>
                  )
          }
        </div>
      </div>
      <div>Date: {moment(order.createDate).fromNow()}</div>
      <div>
        <h2 className='font-semibold mt-4 mb-2'>Products ordered</h2>
        <div className='grid grid-cols-5 text-xs gap-4 pb-2 items-center'>
          <div className='col-span-2 justify-self-start'>PRODUCT</div>
          <div className='justify-self-center'>PRICE</div>
          <div className='justify-self-center'>QUANTITY</div>
          <div className='justify-self-end'>TOTAL</div>
        </div>
        {order.products &&
          order.products.map((product) => {
            return (
              <><OrderItem key={product.id} product={product} ></OrderItem> </>
            )
          })}
      </div>
    </div>
  )
}

export default OrderDetailsView