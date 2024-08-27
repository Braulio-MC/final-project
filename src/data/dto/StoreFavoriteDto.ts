import { Timestamp } from 'firebase-admin/firestore'

export default interface StoreFavoriteDto {
  id: string | undefined
  userId: string | undefined
  storeId: string | undefined
  name: string | undefined
  image: string | undefined
  description: string | undefined
  email: string | undefined
  phoneNumber: string | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  paginationKey: string | undefined
}
