interface Product {
  name: string
  description: string
  isActive: boolean
  price: number
  images: Image[]
}

interface Image {
  response: string
  Product: Product
  productId: string
}

interface Category {
  title: string
  isActive: boolean
  cover?: string
  Products: Product[]
}
