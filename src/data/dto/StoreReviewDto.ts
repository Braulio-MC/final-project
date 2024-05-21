import { Timestamp } from 'firebase-admin/firestore'

export default interface StoreReviewDto {
  id: string | undefined
  userId: string | undefined
  storeId: string | undefined
  rating: number | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  paginationKey: string | undefined
}
