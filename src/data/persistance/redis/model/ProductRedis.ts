import ProductCategoryRedis from './ProductCategoryRedis'
import ProductDiscountRedis from './ProductDiscountRedis'
import ProductStoreRedis from './ProductStoreRedis'

export default interface ProductRedis {
  id: string
  name: string
  description: string
  image: URL
  price: number
  quantity: number
  createdAt: number
  updatedAt: number
  store: ProductStoreRedis
  category: ProductCategoryRedis
  discount: ProductDiscountRedis
  paginationKey: string
}
