import { Timestamp } from 'firebase-admin/firestore'
import OrderStoreDto from './OrderStoreDto'
import OrderUserDto from './OrderUserDto'
import OrderDeliveryLocationDto from './OrderDeliveryLocationDto'
import OrderPaymentMethodDto from './OrderPaymentMethodDto'

export default interface OrderDto {
  id: string | undefined
  status: string | undefined
  total: number | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  store: OrderStoreDto
  user: OrderUserDto
  deliveryLocation: OrderDeliveryLocationDto
  paymentMethod: OrderPaymentMethodDto
  paginationKey: string | undefined
}
