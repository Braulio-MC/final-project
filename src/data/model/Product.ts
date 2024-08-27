import ProductCategory from './ProductCategory'
import ProductDiscount from './ProductDiscount'
import ProductStore from './ProductStore'

export default interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  quantity: number
  rating: number
  createdAt: Date
  updatedAt: Date
  store: ProductStore
  category: ProductCategory
  discount: ProductDiscount
  paginationKey: string
}
