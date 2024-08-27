import OrderLineDto from '../../dto/OrderLineDto'
import IRepository from '../IRepository'

export default interface IOrderlineRepository extends IRepository<OrderLineDto> {
  createAsBatch: (orderId: string, messages: OrderLineDto[]) => Promise<void>
}
