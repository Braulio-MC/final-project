export default interface StoreRedis {
  id: string
  name: string
  description: string
  email: string
  phoneNumber: string
  image: URL
  userId: string
  createdAt: number
  updatedAt: number
  paginationKey: string
}
