import { Timestamp } from 'firebase-admin/firestore'

export default interface ShoppingCartProductDto {
  objectId: string | undefined // Doc id
  id: string | undefined // Product id
  name: string | undefined
  image: string | undefined
  price: number | undefined
  quantity: number | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  paginationKey: string | undefined
}
