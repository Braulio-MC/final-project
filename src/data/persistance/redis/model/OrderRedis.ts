import OrderDeliveryLocationRedis from './OrderDeliveryLocationRedis'
import OrderPaymentMethodRedis from './OrderPaymentMethodRedis'
import OrderStoreRedis from './OrderStoreRedis'
import OrderUserRedis from './OrderUserRedis'

export default interface OrderRedis {
  id: string
  status: string // Change to a dedicated status type as in ChatMessageDto/senderType
  total: number
  createdAt: number
  updatedAt: number
  store: OrderStoreRedis
  user: OrderUserRedis
  deliveryLocation: OrderDeliveryLocationRedis
  paymentMethod: OrderPaymentMethodRedis
  paginationKey: string
}
