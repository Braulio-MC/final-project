import OrderLineProduct from './OrderLineProduct'

export default interface OrderLine {
  id: string
  total: number
  quantity: number
  product: OrderLineProduct
  createdAt: Date
  updatedAt: Date
  paginationKey: string
}
