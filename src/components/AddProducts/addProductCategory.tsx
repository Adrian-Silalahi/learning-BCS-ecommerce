import React from 'react'
import CategoryInput from '../Inputs/categoryInput'
import { categories } from '@/src/utils/Categories'

interface AddProductCategoryProps {
  setFieldValue: (field: string, selectedLabel: string) => void
  category: string
}
const AddProductCategory: React.FC<AddProductCategoryProps> = ({ setFieldValue, category }) => {
  return (
    <>
    <div className='w-full font-medium'>
        <div className='mb-2 font-semibold'>Select a Category</div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto'>
          {categories.map((item) => {
            if (item.label === 'All') {
              return null
            }

            return <div key={item.label} className='col-span'>
              <CategoryInput
              onClick={(categoryParam) => { setFieldValue('category', categoryParam) }}
              selected={item.label === category}
              label={item.label}
              icon={item.icon}
              />
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default AddProductCategory
