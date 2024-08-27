import OrderLineDto from '../../dto/OrderLineDto'
import OrderLine from '../../model/OrderLine'
import IService from '../IService'

export default interface IOrderlineService extends IService<OrderLineDto, OrderLine> {
  createAsBatch: (orderId: string, messages: OrderLineDto[]) => Promise<void>
}
