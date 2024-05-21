export default interface ProductReview {
  id: string
  userId: string
  productId: string
  rating: number
  createdAt: Date
  updatedAt: Date
  paginationKey: string
}
