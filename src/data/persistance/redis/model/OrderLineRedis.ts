import OrderLineProductRedis from './OrderLineProductRedis'

export default interface OrderLineRedis {
  id: string
  total: number
  quantity: number
  product: OrderLineProductRedis
  createdAt: number
  updatedAt: number
  paginationKey: string
}
