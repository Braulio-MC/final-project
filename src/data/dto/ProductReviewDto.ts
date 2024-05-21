import { Timestamp } from 'firebase-admin/firestore'

export default interface ProductReviewDto {
  id: string | undefined
  userId: string | undefined
  productId: string | undefined
  rating: number | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  paginationKey: string | undefined
}
