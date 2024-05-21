import { inject, singleton } from 'tsyringe'
import OrderDto from '../dto/OrderDto'
import mapper from '../../core/Mapper'
import Order from '../model/Order'
import IOrderRepository from '../repository/order/IOrderRepository'
import Criteria from '../../core/criteria/Criteria'
import { OrderResult, PagingResult } from '../../types'
import IOrderService from './IOrderService'
import OrderLineDto from '../dto/OrderLineDto'

@singleton()
export default class OrderService implements IOrderService {
  constructor (
    @inject('OrderRepository') private readonly repository: IOrderRepository
  ) {}

  async create (item: OrderDto, orderLine: OrderLineDto[]): Promise<void> {
    await this.repository.create(item, orderLine)
  }

  async update (id: string, item: Partial<OrderDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Order>> {
    const result = await this.repository.paging(limit, after, before)
    const pagignResult: PagingResult<Order> = {
      data: result.data.map(dto => mapper.map<OrderResult, Order>(dto, 'OrderResult', 'Order')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }

  async findById (id: string): Promise<Order | null> {
    const result = await this.repository.findById(id)
    if (result !== null) {
      return mapper.map<OrderResult, Order>(result, 'OrderResult', 'Order')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Order>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const pagingResult: PagingResult<Order> = {
      data: result.data.map(dto => mapper.map<OrderResult, Order>(dto, 'OrderResult', 'Order')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagingResult
  }
}
