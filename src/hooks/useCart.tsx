'use client'

import React, { createContext, useCallback, useContext, useState, useEffect } from 'react'
import { type ProductType } from '@/src/types'
import { toast } from 'react-hot-toast'
import axios from 'axios'

// Mendefinisikan type dari value²/data yang disediakan cart context
interface CartContextType {
  cartTotalQuantity: number
  cartTotalPrice: number
  cartProducts: ProductType[] | null
  setIsLogin: (value: boolean) => void
  handleAddProductToCart: (product: ProductType) => void
  handleRemoveProductFromCart: (itemSelected: ProductType) => void
  handleIncreaseProductCartQty: (itemSelected: ProductType) => void
  handleDecreaseProductCartQty: (itemSelected: ProductType) => void
  handleClearCart: () => void
}

// Syntax untuk membuat sebuah context
// Dimana context-nya kita beri nama CartContext
export const CartContext = createContext<CartContextType | null>(null)

interface ProviderProps {
  // [propName: string]: any // Memungkinkan kita menerima props apa saja yang dikirimkan melalui <CartContext.Provider {"props apa saja"} > yang kita letakkan di layout.tsx (lihat di eps23 - 4)
  children: React.ReactNode
}

// Membuat sebuah provider / penyedia pada sebuah context
export const CartContextProvider: React.FC<ProviderProps> = ({
  // props,
  children
}) => {
  const [cartTotalQuantity, setcartTotalQuantity] = useState(0)
  const [cartTotalPrice, setCartTotalPrice] = useState(0)
  const [cartProducts, setCartProducts] = useState<ProductType[] | []>([])
  const [isLogin, setIsLogin] = useState(false)

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
    setIsLogin,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleIncreaseProductCartQty,
    handleDecreaseProductCartQty,
    handleClearCart
  }

  return (
    // Kita masukkan value/data yang sudah kita sediakan, kedalam provider.
    // Value ini nanti dapat kita gunakan pada komponen² yang berada di dalam lingkup cart context provider atau children dari cart context provider
    // Dimana Value ini adalah sebagai data/fungsi yang ingin kita gunakan
    <CartContext.Provider value={value}>
      {/* <CartContext.Provider value={value} {...props}> */}
      {children}
    </CartContext.Provider>
    // Namun, kita juga bisa memisahkan provider kedalam file lain agar codingan terlihat rapi
    // Lihat di ../providers/cartProviders.tsx
  )
}

// Export cartContext yang sudah kita buat, agar datanya bisa kita gunakan pada-
// komponen² yang berada di dalam lingkup cart context provider
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)

  // Namun, jika komponen yang kita gunakan masih belum dibungkus dengan provider, maka akan memunculkan error seperti dibawah
  if (context === null) {
    throw new Error('useCart must be used within a CartContextProvider')
  }

  return context
}
