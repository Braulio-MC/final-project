import { Timestamp } from 'firebase-admin/firestore'

export default interface ProductDiscountDto {
  id: string | undefined
  percentage: number | undefined
  startDate: Timestamp | undefined
  endDate: Timestamp | undefined
}
