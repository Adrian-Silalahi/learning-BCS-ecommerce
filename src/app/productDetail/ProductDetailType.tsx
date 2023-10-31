export interface ProductType {
  id: string
  name: string
  description: string
  category: string
  brand: string
  imageInfo: ImageInfoType
  quantity: number
  price: number
}

export interface ImageInfoType {
  color: string
  colorCode: string
  image: string
}
