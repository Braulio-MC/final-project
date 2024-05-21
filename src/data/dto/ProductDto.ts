import { Timestamp } from 'firebase-admin/firestore'
import ProductStoreDto from './ProductStoreDto'
import ProductCategoryDto from './ProductCategoryDto'
import ProductDiscountDto from './ProductDiscountDto'

export default interface ProductDto {
  id: string | undefined
  name: string | undefined
  description: string | undefined
  image: URL | undefined
  price: number | undefined
  quantity: number | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  store: ProductStoreDto
  category: ProductCategoryDto
  discount: ProductDiscountDto
  paginationKey: string | undefined
}
