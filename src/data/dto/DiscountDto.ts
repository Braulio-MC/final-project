import { Timestamp } from 'firebase-admin/firestore'

export default interface DiscountDto {
  id: string | undefined
  percentage: number | undefined
  startDate: Timestamp | undefined
  endDate: Timestamp | undefined
  storeId: string | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  paginationKey: string | undefined
}
