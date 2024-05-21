export default interface Discount {
  id: string
  percentage: number
  startDate: Date
  endDate: Date
  storeId: string
  createdAt: Date
  updatedAt: Date
  paginationKey: string
}
