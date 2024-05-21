import Filters from './Filters'
import Order from './Order'

export default class Criteria {
  readonly filters: Filters
  readonly order: Order
  readonly limit: number | null
  readonly after: string | null
  readonly before: string | null

  constructor (
    filters: Filters,
    order: Order,
    limit: number | null,
    after: string | null = null,
    before: string | null = null
  ) {
    this.filters = filters
    this.order = order
    this.limit = limit
    this.after = after
    this.before = before
  }
}
