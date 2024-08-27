import { Timestamp } from 'firebase-admin/firestore'
import OrderLineProductDto from './OrderLineProductDto'

export default interface OrderLineDto {
  id: string | undefined
  total: number | undefined
  quantity: number | undefined
  product: OrderLineProductDto
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  paginationKey: string | undefined
}
