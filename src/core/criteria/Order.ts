import OrderType from './OrderType'
import OrderTypes from './OrderTypes'

export default class Order {
  constructor (public readonly orderBy: string, public readonly orderType: OrderType) {
    this.orderBy = orderBy
    this.orderType = orderType
  }

  public static fromValues (orderBy?: string, orderType?: string): Order {
    if (orderBy == null) {
      return new Order('', new OrderType(OrderTypes.NONE))
    }
    return new Order(orderBy, OrderType.fromValue(orderType ?? OrderTypes.ASC))
  }

  public hasOrder (): boolean {
    return !this.orderType.isNone()
  }

  toRedisKey (): string {
    return `${this.orderBy}_${this.orderType.toRedisKey()}`
  }
}
