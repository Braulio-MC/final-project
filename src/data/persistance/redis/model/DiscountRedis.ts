export default interface DiscountRedis {
  id: string
  percentage: number
  startDate: number
  endDate: number
  storeId: string
  createdAt: number
  updatedAt: number
  paginationKey: string
}
