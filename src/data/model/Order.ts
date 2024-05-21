import OrderDeliveryLocation from './OrderDeliveryLocation'
import OrderLine from './OrderLine'
import OrderPaymentMethod from './OrderPaymentMethod'
import OrderStore from './OrderStore'
import OrderUser from './OrderUser'

export default interface Order {
  id: string
  status: string
  total: number
  createdAt: Date
  updatedAt: Date
  store: OrderStore
  user: OrderUser
  deliveryLocation: OrderDeliveryLocation
  paymentMethod: OrderPaymentMethod
  orderLines: OrderLine[]
  paginationKey: string
}
