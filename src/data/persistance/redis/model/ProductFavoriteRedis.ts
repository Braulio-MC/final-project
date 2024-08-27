export default interface ProductFavoriteRedis {
  id: string
  userId: string
  productId: string
  productName: string
  productImage: URL
  productDescription: string
  createdAt: number
  updatedAt: number
  paginationKey: string
}
