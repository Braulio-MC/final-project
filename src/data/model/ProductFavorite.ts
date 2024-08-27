export default interface ProductFavorite {
  id: string
  userId: string
  productId: string
  productName: string
  productImage: string
  productDescription: string
  createdAt: Date
  updatedAt: Date
  paginationKey: string
}
