export default interface StoreReviewRedis {
  id: string
  userId: string
  storeId: string
  rating: number
  createdAt: number
  updatedAt: number
  paginationKey: string
}
