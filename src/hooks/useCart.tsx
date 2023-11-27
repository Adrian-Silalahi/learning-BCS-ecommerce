'use client'

import React, { createContext, useCallback, useContext, useState, useEffect } from 'react'
import { type ProductType } from '@/src/types'
import { toast } from 'react-hot-toast'
import axios from 'axios'

interface CartContextType {
  cartTotalQuantity: number
  cartTotalPrice: number
  cartProducts: ProductType[] | null
  isCheckoutLoading: boolean
  setIsCheckoutLoading: (value: boolean) => void
  setIsLogin: (value: boolean) => void
  handleAddProductToCart: (product: ProductType) => void
  handleRemoveProductFromCart: (itemSelected: ProductType) => void
  handleIncreaseProductCartQty: (itemSelected: ProductType) => void
  handleDecreaseProductCartQty: (itemSelected: ProductType) => void
  handleClearCart: () => void
}

export const CartContext = createContext<CartContextType | null>(null)

interface ProviderProps {
  children: React.ReactNode
}
export const CartContextProvider: React.FC<ProviderProps> = ({
  children
}) => {
  const [cartTotalQuantity, setcartTotalQuantity] = useState(0)
  const [cartTotalPrice, setCartTotalPrice] = useState(0)
  const [cartProducts, setCartProducts] = useState<ProductType[] | []>([])
  const [isLogin, setIsLogin] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)


  useEffect(() => {
    axios.get('/api/cart').then(response => {
      setCartProducts(response.data)
    }).catch((error) => {
      const errorMessage = error.response.data.error
      console.log(errorMessage)
    })
  }, [isLogin])

  useEffect(() => {
    const getTotals = (): void => {
      if (cartProducts.length !== 0) {
        const { totalQtyOneProduct, totalPriceOneProduct } =
          cartProducts.reduce(
            (akumulator, elemen) => {
              return {
                totalQtyOneProduct:
                  akumulator.totalQtyOneProduct + elemen.quantity,
                totalPriceOneProduct:
                  akumulator.totalPriceOneProduct +
                  elemen.price * elemen.quantity
              }
            },
            {
              totalQtyOneProduct: 0,
              totalPriceOneProduct: 0
            }
          )
        setcartTotalQuantity(totalQtyOneProduct)
        setCartTotalPrice(totalPriceOneProduct)
      }
    }
    getTotals()
  }, [cartProducts])

  const handleAddProductToCart = useCallback((product: ProductType) => {
    setCartProducts(prev => {
      let updatedCart
      if (prev !== null) {
        updatedCart = [...prev, product]
      } else {
        updatedCart = [product]
      }
      axios.post('/api/cart', product).then(()=> toast.success('Produk ditambahkan ke keranjang'))
      return updatedCart
    })
  }, [])

  const handleRemoveProductFromCart = useCallback((itemSelected: ProductType) => {
      axios.delete(`/api/cart/${itemSelected.id}`)
      .then(() => {
        if (cartProducts !== null) {
          const filterProduct = cartProducts.filter((product) => {
            return product.id !== itemSelected.id
          })
          setCartProducts(filterProduct)
          setcartTotalQuantity(
            cartTotalQuantity - itemSelected.quantity
          )
        }
        toast.success('Produk dihapus dari keranjang')
      }).catch((error) => {
        toast.error('Failed to delete product')
        console.log(error)
      })
    },
    [cartProducts]
  )

  const handleClearCart = useCallback(() => {
    axios.delete('/api/cart').then(()=> {
      setCartProducts([])
      setcartTotalQuantity(0)
    })
  }, [])

  const handleIncreaseProductCartQty = useCallback((itemSelected: ProductType) => {
    axios.get(`/api/product/${itemSelected.productId}`).then(response => {
      const stock = response.data
      let updatedProduct
      if (itemSelected.quantity >= stock) {
        return toast(`Kamu hanya dapat menambahkan ${itemSelected.quantity} produk`)
      }
  
      if (cartProducts !== null) {
        updatedProduct = [...cartProducts]
  
        const existingIndex = cartProducts.findIndex(
          (product) => product.id === itemSelected.id
        )
  
        if (existingIndex > -1) {
          updatedProduct[existingIndex].quantity = ++updatedProduct[
            existingIndex
          ].quantity
        }
  
        setCartProducts(updatedProduct)
        localStorage.setItem(
          'cartItemsStorage',
          JSON.stringify(updatedProduct)
        )
      }
    })
    },
    [cartProducts]
  )

  const handleDecreaseProductCartQty = useCallback(
    (itemSelected: ProductType) => {
      let updatedProduct

      if (itemSelected.quantity <= 1) {
        return toast.error('Oops, jumlah minimum tercapai')
      }

      if (cartProducts !== null) {
        updatedProduct = [...cartProducts]

        const existingIndex = cartProducts.findIndex(
          (product) => product.id === itemSelected.id
        )

        if (existingIndex > -1) {
          updatedProduct[existingIndex].quantity = --updatedProduct[
            existingIndex
          ].quantity
        }
        setCartProducts(updatedProduct)
        localStorage.setItem(
          'cartItemsStorage',
          JSON.stringify(updatedProduct)
        )
      }
    },
    [cartProducts]
  )

 

  const value = {
    cartTotalPrice,
    cartTotalQuantity,
    cartProducts,
    isCheckoutLoading,
    setIsCheckoutLoading,
    setIsLogin,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleIncreaseProductCartQty,
    handleDecreaseProductCartQty,
    handleClearCart

  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)

  if (context === null) {
    throw new Error('useCart must be used within a CartContextProvider')
  }

  return context
}
