export default interface ProductReviewRedis {
  id: string
  userId: string
  productId: string
  rating: number
  createdAt: number
  updatedAt: number
  paginationKey: string
}
