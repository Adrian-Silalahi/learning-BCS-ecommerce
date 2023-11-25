import Heading from '@/src/components/Heading'
import { Rating } from '@mui/material'
import React from 'react'
import moment from 'moment'
import Avatar from '@/src/components/Avatar'

interface ListRatingProps {
  product: any
}

const ListRating: React.FC<ListRatingProps> = ({ product }) => {
  if (product.reviews.length === 0) return null
  return (
    <div>
      <Heading title="Product Review" />
      <div className="text-sm mt-2">
        {product?.reviews?.map((review: any) => {
          return (
              <div key={review.id}>
                <div className="flex gap-2 items-center">
                  <Avatar src={review?.user?.image} />
                  <div className="font-semibold">{review?.user?.name}</div>
                  <div className="font-light">
                    {moment(review.createdDate).fromNow()}
                  </div>
                </div>
                <div className="mt-2">
                  <Rating value={review?.rating} readOnly />
                  <div className="ml-2">{review?.comment}</div>
                  <hr className="my-4" />
                </div>
              </div>
          )
        })}
      </div>
    </div>
  )
}

export default ListRating
