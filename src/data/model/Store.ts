export default interface Store {
  id: string
  name: string
  description: string
  email: string
  phoneNumber: string
  image: string
  rating: number
  userId: string
  createdAt: Date
  updatedAt: Date
  paginationKey: string
}
