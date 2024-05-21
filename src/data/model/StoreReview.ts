export default interface StoreReview {
  id: string
  userId: string
  storeId: string
  rating: number
  createdAt: Date
  updatedAt: Date
  paginationKey: string
}
