import { Timestamp } from 'firebase-admin/firestore'

export default interface PaymentDto {
  id: string | undefined
  name: string | undefined
  description: string | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  paginationKey: string | undefined
}
