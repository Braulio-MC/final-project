export default interface StoreFavoriteRedis {
  id: string
  userId: string
  storeId: string
  name: string
  image: URL
  description: string
  email: string
  phoneNumber: string
  createdAt: number
  updatedAt: number
  paginationKey: string
}
