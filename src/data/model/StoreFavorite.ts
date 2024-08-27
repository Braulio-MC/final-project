export default interface StoreFavorite {
  id: string
  userId: string
  storeId: string
  name: string
  image: string
  description: string
  email: string
  phoneNumber: string
  createdAt: Date
  updatedAt: Date
  paginationKey: string
}
