import OrderDto from '../../../data/dto/OrderDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IOrderDtoBuilder extends IBaseBuilder<IOrderDtoBuilder, OrderDto> {
  setStatus: (status: string) => IOrderDtoBuilder
  setTotal: (total: number) => IOrderDtoBuilder
  setUserId: (id: string) => IOrderDtoBuilder
  setUserName: (name: string) => IOrderDtoBuilder
  setStoreId: (id: string) => IOrderDtoBuilder
  setStoreName: (name: string) => IOrderDtoBuilder
  setDeliveryLocationId: (id: string) => IOrderDtoBuilder
  setDeliveryLocationName: (name: string) => IOrderDtoBuilder
  setPaymentMethodId: (id: string) => IOrderDtoBuilder
  setPaymentMethodName: (name: string) => IOrderDtoBuilder
}
