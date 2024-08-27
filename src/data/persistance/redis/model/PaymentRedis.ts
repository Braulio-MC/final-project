export default interface PaymentRedis {
  id: string
  name: string
  description: string
  createdAt: number
  updatedAt: number
  paginationKey: string
}
