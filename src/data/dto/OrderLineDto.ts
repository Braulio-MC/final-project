import OrderLineProductDto from './OrderLineProductDto'

export default interface OrderLineDto {
  id: string | undefined
  total: number | undefined
  quantity: number | undefined
  product: OrderLineProductDto
}
