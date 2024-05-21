import { Timestamp } from 'firebase-admin/firestore'

export default interface ProductFavoriteDto {
  id: string | undefined
  userId: string | undefined
  productId: string | undefined
  productName: string | undefined
  productImage: URL | undefined
  productDescription: string | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  paginationKey: string | undefined
}
