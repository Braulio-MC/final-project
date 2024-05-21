import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'
import OrderDto from '../dto/OrderDto'
import OrderLineDto from '../dto/OrderLineDto'
import Order from '../model/Order'

export default interface IOrderService {
  create: (item: OrderDto, orderLines: OrderLineDto[]) => Promise<void>
  update: (id: string, item: Partial<OrderDto>) => Promise<void>
  paging: (limit: number, after: string, before: string) => Promise<PagingResult<Order>>
  findById: (id: string) => Promise<Order | null>
  delete: (id: string) => Promise<void>
  pagingByCriteria: (criteria: Criteria) => Promise<PagingResult<Order>>
}
