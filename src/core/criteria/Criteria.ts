import { DEFAULT_PAGING_AFTER, DEFAULT_PAGING_BEFORE, DEFAULT_PAGING_LIMIT } from '../Constants'
import Filters from './Filters'
import Order from './Order'
import OrderType from './OrderType'
import OrderTypes from './OrderTypes'

export default class Criteria {
  readonly filters: Filters
  readonly order: Order
  readonly limit: number | null
  readonly after: string | null
  readonly before: string | null

  constructor (
    filters: Filters,
    limit: number | null,
    order: Order = new Order('', new OrderType(OrderTypes.NONE)),
    after: string | null = null,
    before: string | null = null
  ) {
    this.filters = filters
    this.order = order
    this.limit = limit
    this.after = after
    this.before = before
  }

  toRedisKey (): string {
    const limit = this.limit ?? DEFAULT_PAGING_LIMIT
    const after = this.after ?? DEFAULT_PAGING_AFTER
    const before = this.before ?? DEFAULT_PAGING_BEFORE
    return `${this.filters.toRedisKey()}_${this.order.toRedisKey()}_${limit}_${after}_${before}`
  }
}
