import OrderLineDto from '../../../data/dto/OrderLineDto'
import IOrderLineDtoBuilder from './IOrderLineDtoBuilder'

export default class OrderLineDtoBuilder implements IOrderLineDtoBuilder {
  private orderLineDto!: OrderLineDto[]

  constructor () {
    this.reset()
  }

  private reset (): void {
    this.orderLineDto = []
  }

  setOrderLines (lines: OrderLineDto[]): IOrderLineDtoBuilder {
    this.orderLineDto = lines
    return this
  }

  build (): OrderLineDto[] {
    const result = this.orderLineDto
    this.reset()
    return result
  }
}
