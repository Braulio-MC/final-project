import { Timestamp } from 'firebase-admin/firestore'
import ShoppingCartStoreDto from './ShoppingCartStoreDto'

export default interface ShoppingCartDto {
  id: string | undefined
  userId: string | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  store: ShoppingCartStoreDto
  paginationKey: string | undefined
}
