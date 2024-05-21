import OrderLineDto from '../../../data/dto/OrderLineDto'

export default interface IOrderLineDtoBuilder {
  setOrderLines: (lines: OrderLineDto[]) => IOrderLineDtoBuilder
  build: () => OrderLineDto[]
}
