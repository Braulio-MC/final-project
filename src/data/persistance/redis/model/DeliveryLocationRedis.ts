export default interface DeliveryLocationRedis {
  id: string
  name: string
  description: string
  storeId: string
  createdAt: number
  updatedAt: number
  paginationKey: string
}
