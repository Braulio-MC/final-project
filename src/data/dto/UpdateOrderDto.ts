import { Timestamp } from 'firebase-admin/firestore'

export default interface UpdateOrderDto {
  id: undefined
  status: string | undefined // Change to a dedicated status type as in ChatMessageDto/senderType
  total: undefined
  createdAt: undefined
  updatedAt: Timestamp | undefined
  store: undefined
  user: undefined
  deliveryLocation: undefined
  paymentMethod: undefined
  paginationKey: undefined
}
