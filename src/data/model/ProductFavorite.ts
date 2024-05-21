export default interface ProductFavorite {
  id: string
  userId: string
  productId: string
  productName: string
  productImage: URL
  productDescription: string
  createdAt: Date
  updatedAt: Date
  paginationKey: string
}
