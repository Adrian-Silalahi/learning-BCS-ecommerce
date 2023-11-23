'use client'

import { Rating } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import ProductRating from '../utils/AverageRating'
import Hr from '../components/Hr'
import SetColor from '../components/Products/setColorProduct'
import {
  type ProductType,
  type ImageInfoType
} from '@/src/types'
import Counter from '../components/Counter/counter'
import CustomButton from '../components/CustomButton'
import ProductImage from '../components/Products/productImage'
import { useCart } from '../hooks/useCart'
import { MdArrowBack, MdCheckCircle } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { User } from '@prisma/client'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';

interface TypeProps {
  product: any
  user: User
}

const ProductDetailView: React.FC<TypeProps> = ({ product, user }) => {
  // Product disini adalah data dari product yang halaman detailnya ditampilkan
  const router = useRouter()
  const { handleAddProductToCart, cartProducts } = useCart()
  const [isProductInCart, setIsProductInCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductType>({
    id: uuidv4(),
    productId: product.id,
    userId: user?.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    imageInfo: { ...product.imageInfo[0] },
    quantity: 1,
    price: product.price
  })

  // Cek apakah ada product di dalam cart
  useEffect(() => {
    if (cartProducts !== null && cartProducts.length) {
          //onDetailProducts artinya product-product yang dilihat detailnya dan ada di dalam cart
        //Kenapa jamak? karena product idnya sama ada beberapa. Cth: product id:1 ada 2 yaitu merah dan biru.
        const onDetailProducts = cartProducts.filter((product) => {
              return product.productId === selectedProduct.productId
          })

        if(onDetailProducts){
          const existingIndex = onDetailProducts.findIndex(
            (product) => product.imageInfo.color === selectedProduct.imageInfo.color
          )
            if (existingIndex > -1) { // jika index-nya adalah index ke-0 keatas ... maka ada selected product di dalam cart
          setIsProductInCart(true)
          }else{
          setIsProductInCart(false)
        }
      }
      }
      else{
        setIsProductInCart(false)}
  }, [cartProducts, selectedProduct])
  
  // handleColorSelect adalah function yang akan dipanggil ketika user memilih color
  const handleColorSelect = useCallback(
    (selectedImageInfo: ImageInfoType) => {
      setSelectedProduct((prev) => {
        return { ...prev, imageInfo: selectedImageInfo, id: uuidv4(), quantity: 1 }
      })
    },
    [selectedProduct.imageInfo]
  )

  const handleIncreaseQuantity = useCallback(() => {
    if (selectedProduct.quantity === product.stock) {
      return // Keluar dari fungsi tanpa mengembalikan nilai
    }
    setSelectedProduct((prev) => {
      return { ...prev, quantity: ++selectedProduct.quantity }
    })
  }, [selectedProduct.quantity])

  const handleDecreaseQuantity = useCallback(() => {
    if (selectedProduct.quantity === 1) {
      return // Keluar dari fungsi tanpa mengembalikan nilai
    }
    setSelectedProduct((prev) => {
      return { ...prev, quantity: --selectedProduct.quantity }
    })
  }, [selectedProduct.quantity])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Gambar Produk */}
      <ProductImage
        selectedProduct={selectedProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />

      {/* Produk details */}
      <div className="flex flex-col gap-1 text-slate-500 text-sm">
        <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
        <div className="flex items-center gap-2">
          <Rating value={ProductRating(product.reviews)} readOnly/>
          <div>{product.reviews.length} reviews</div>
        </div>
        <Hr />
        <div className="text-justify">{product.description}</div>
        <Hr />
        <div>
          <span className="text-slate-700 font-semibold">CATEGORY</span>:{' '}
          {product.category}
        </div>
        <div>
          <span className="text-slate-700 font-semibold">BRAND</span>:{' '}
          {product.brand}
        </div>
        <div>
          <span className="text-slate-700 font-semibold">PRICE</span>:{' '}
          {product.price}
        </div>
        <div>
          <span className="text-slate-700 font-semibold">STOCK</span>:{' '}
          {product.stock}
        </div>
        <Hr />
        <SetColor
              images={product.imageInfo}
              currentImageColor={selectedProduct.imageInfo.color}
              handleColorSelect={handleColorSelect}
            />
            <Hr />
        {
          !user
          ? (
          <div className="flex flex-col items-center">
            <div className="text-2xl">Please login first</div>
            <div>
              <Link
                href={'/login'}
                className="
                      text-slate-500 flex items-center gap-1 mt-2"
              >
                <MdArrowBack />
                <span>Login</span>
              </Link>
            </div>
          </div>
            )
            : isProductInCart
            ? (
            <>
              <p className="flex gap-1">
                <MdCheckCircle className="text-teal-400" size={20} />
                <span>Product added to cart</span>
              </p>
              <div className="max-w-[300px]">
                <CustomButton
                  label="View Cart"
                  outline
                  onClick={() => {
                    router.push('/cart')
                  }}
                />
              </div>
            </>
              ) : (
                <>
              <Counter
              isQuantity={true}
              currentQuantity={selectedProduct.quantity}
              handleDecreaseQuantity={handleDecreaseQuantity}
              handleIncreaseQuantity={handleIncreaseQuantity}
            />
            <Hr />
              <div className="max-w-[300px]">
              <CustomButton
                label="Add to cart"
                onClick={() => {
                  handleAddProductToCart(selectedProduct)
                }}
              />
            </div>
            </>
              )
        }
      </div>
    </div>
  )
}

export default ProductDetailView
