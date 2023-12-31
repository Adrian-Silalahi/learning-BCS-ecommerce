import React from 'react'
import Input from '../Inputs/input'
import TextArea from '../Inputs/textArea'

interface AddProductFormProps {
  isLoading: boolean
  register: any
  errors: any
}
const AddProductForm: React.FC<AddProductFormProps> = ({ isLoading, register, errors }) => {
  return (
    <>
    <Input
      id='name'
      label='Name'
      disabled={isLoading}
      register={register}
      errors={errors}
      required
      />
      <Input
      id='price'
      label='Price'
      disabled={isLoading}
      register={register}
      errors={errors}
      type='number'
      required
      />
      <Input
      id='brand'
      label='Brand'
      disabled={isLoading}
      register={register}
      errors={errors}
      required
      />
      <TextArea
      id='description'
      label='Description'
      disabled={isLoading}
      register={register}
      errors={errors}
      required
      />
      <Input
      id='stock'
      label='Stock'
      disabled={isLoading}
      register={register}
      errors={errors}
      type='number'
      required
      />
    </>
  )
}

export default AddProductForm
