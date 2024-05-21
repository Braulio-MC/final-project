import Criteria from '../../../core/criteria/Criteria'
import { OrderResult, PagingResult } from '../../../types'
import OrderDto from '../../dto/OrderDto'
import OrderLineDto from '../../dto/OrderLineDto'

export default interface IOrderRepository {
  create: (item: OrderDto, orderLines: OrderLineDto[]) => Promise<void>
  update: (id: string, item: Partial<OrderDto>) => Promise<void>
  paging: (limit: number, after: string, before: string) => Promise<PagingResult<OrderResult>>
  findById: (id: string) => Promise<OrderResult | null>
  delete: (id: string) => Promise<void>
  pagingByCriteria: (criteria: Criteria) => Promise<PagingResult<OrderResult>>
}
