import { Timestamp } from 'firebase-admin/firestore'

export default interface StoreDto {
  id: string | undefined
  name: string | undefined
  description: string | undefined
  email: string | undefined
  phoneNumber: string | undefined
  image: string | undefined
  userId: string | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  paginationKey: string | undefined
}
