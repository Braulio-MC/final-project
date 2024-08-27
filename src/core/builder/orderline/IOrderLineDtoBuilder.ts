import OrderLineDto from '../../../data/dto/OrderLineDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IOrderLineDtoBuilder extends IBaseBuilder<IOrderLineDtoBuilder, OrderLineDto> {
  setTotal: (total: number) => IOrderLineDtoBuilder
  setQuantity: (quantity: number) => IOrderLineDtoBuilder
  setProductId: (id: string) => IOrderLineDtoBuilder
  setProductName: (name: string) => IOrderLineDtoBuilder
  setProductImage: (image: string) => IOrderLineDtoBuilder
  setProductPrice: (price: number) => IOrderLineDtoBuilder
}
