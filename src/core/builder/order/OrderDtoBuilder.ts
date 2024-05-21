import { Timestamp } from 'firebase-admin/firestore'
import OrderDto from '../../../data/dto/OrderDto'
import IOrderDtoBuilder from './IOrderDtoBuilder'
import { UUID } from 'crypto'

export default class OrderDtoBuilder implements IOrderDtoBuilder {
  private orderDto!: OrderDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetOrderDto: OrderDto = {
      id: undefined,
      status: undefined,
      total: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      store: {
        id: undefined,
        name: undefined
      },
      user: {
        id: undefined,
        name: undefined
      },
      deliveryLocation: {
        id: undefined,
        name: undefined
      },
      paymentMethod: {
        id: undefined,
        name: undefined
      },
      paginationKey: undefined
    }
    this.orderDto = resetOrderDto
  }

  setStatus (status: string): IOrderDtoBuilder {
    this.orderDto.status = status
    return this
  }

  setTotal (total: number): IOrderDtoBuilder {
    this.orderDto.total = total
    return this
  }

  setCreatedAt (at: Timestamp): IOrderDtoBuilder {
    this.orderDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IOrderDtoBuilder {
    this.orderDto.updatedAt = at
    return this
  }

  setUserId (id: string): IOrderDtoBuilder {
    this.orderDto.user.id = id
    return this
  }

  setUserName (name: string): IOrderDtoBuilder {
    this.orderDto.user.name = name
    return this
  }

  setStoreId (id: string): IOrderDtoBuilder {
    this.orderDto.store.id = id
    return this
  }

  setStoreName (name: string): IOrderDtoBuilder {
    this.orderDto.store.name = name
    return this
  }

  setDeliveryLocationId (id: string): IOrderDtoBuilder {
    this.orderDto.deliveryLocation.id = id
    return this
  }

  setDeliveryLocationName (name: string): IOrderDtoBuilder {
    this.orderDto.deliveryLocation.name = name
    return this
  }

  setPaymentMethodId (id: string): IOrderDtoBuilder {
    this.orderDto.paymentMethod.id = id
    return this
  }

  setPaymentMethodName (name: string): IOrderDtoBuilder {
    this.orderDto.paymentMethod.name = name
    return this
  }

  setPaginationKey (key: UUID): IOrderDtoBuilder {
    this.orderDto.paginationKey = key
    return this
  }

  build (): OrderDto {
    const result = this.orderDto
    this.reset()
    return result
  }
}
