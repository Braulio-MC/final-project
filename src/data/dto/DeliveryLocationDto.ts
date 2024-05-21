import { Timestamp } from 'firebase-admin/firestore'

export default interface DeliveryLocationDto {
  id: string | undefined
  name: string | undefined
  description: string | undefined
  storeId: string | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  paginationKey: string | undefined
}
