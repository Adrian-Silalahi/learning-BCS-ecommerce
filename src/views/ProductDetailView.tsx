'use client'

import { Rating } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import ProductRating from '../utils/AverageRating'
import Hr from '../components/Hr'
import SetColor from '../components/Products/setColorProduct'
import {
  type ProductType,
  type ImageInfoType
} from '../app/productDetail/ProductDetailType'
import Counter from '../components/Counter/counter'
import CustomButton from '../components/CustomButton'
import ProductImage from '../components/Products/productImage'
import { useCart } from '../hooks/useCart'
import { MdCheckCircle } from 'react-icons/md'
import { useRouter } from 'next/navigation'

interface TypeProps {
  product: any
}

const ProductDetailView: React.FC<TypeProps> = ({ product }) => {
  // Product disini adalah data dari product yang halaman detailnya ditampilkan
  const router = useRouter()
  const { handleAddProductToCart, cartProducts } = useCart()
  const [isProductInCart, setIsProductInCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductType>({
    id: product.id,
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
    if (cartProducts !== null) {
      // lakukan pengecekan, apakah product ini ada di cartProducts. Dengan cara menCek apakah id product yang dilihat detailnya ini, ada yang sama dengan id product yang ada di cartProducts. Jika ada product di cart yang id-nya sama dengan id product atau (cartProduct.id === product.id). Jika ada yang sama, maka product ini ada di dalam cartProducts. Lalu kita cek index ke berapa dia berada di dalam cartProducts. Berikut adalah caranya:
      const existingIndex = cartProducts.findIndex(
        (cartProduct) => cartProduct.id === product.id
      )
      if (existingIndex > -1) { // jika index-nya adalah index ke-0 keatas ... maka ada product di dalam cart
        setIsProductInCart(true)
      }
    }
  }, [cartProducts])

  // handleColorSelect adalah function yang akan dipanggil ketika user memilih color
  const handleColorSelect = useCallback(
    (selectedImageInfo: ImageInfoType) => {
      setSelectedProduct((prev) => {
        return { ...prev, imageInfo: selectedImageInfo }
      })
    },
    [selectedProduct.imageInfo]
  )

  const handleIncreaseQuantity = useCallback(() => {
    if (selectedProduct.quantity === 99) {
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
          <Rating value={ProductRating(product.reviews)} />
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
        <div
          className={`${product?.inStock ? 'text-teal-400' : 'text-rose-400'}`}
        >
          {product?.inStock ? 'In stock' : 'Out of stock'}
        </div>
        <Hr />
        {isProductInCart
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
            )
          : (
          <>
            <SetColor
              images={product.imageInfo}
              currentImageColor={selectedProduct.imageInfo.color}
              handleColorSelect={handleColorSelect}
            />
            <Hr />
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
            )}
      </div>
    </div>
  )
}

export default ProductDetailView
