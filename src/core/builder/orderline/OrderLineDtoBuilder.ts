import { UUID } from 'crypto'
import OrderLineDto from '../../../data/dto/OrderLineDto'
import IOrderLineDtoBuilder from './IOrderLineDtoBuilder'
import { Timestamp } from 'firebase-admin/firestore'

export default class OrderLineDtoBuilder implements IOrderLineDtoBuilder {
  private orderLineDto!: OrderLineDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetOrderLineDto: OrderLineDto = {
      id: undefined,
      total: undefined,
      quantity: undefined,
      product: {
        id: undefined,
        name: undefined,
        image: undefined,
        price: undefined
      },
      createdAt: undefined,
      updatedAt: undefined,
      paginationKey: undefined
    }
    this.orderLineDto = resetOrderLineDto
  }

  setTotal (total: number): IOrderLineDtoBuilder {
    this.orderLineDto.total = total
    return this
  }

  setQuantity (quantity: number): IOrderLineDtoBuilder {
    this.orderLineDto.quantity = quantity
    return this
  }

  setProductId (id: string): IOrderLineDtoBuilder {
    this.orderLineDto.product.id = id
    return this
  }

  setProductName (name: string): IOrderLineDtoBuilder {
    this.orderLineDto.product.name = name
    return this
  }

  setProductImage (image: string): IOrderLineDtoBuilder {
    this.orderLineDto.product.image = image
    return this
  }

  setProductPrice (price: number): IOrderLineDtoBuilder {
    this.orderLineDto.product.price = price
    return this
  }

  setCreatedAt (at: Timestamp): IOrderLineDtoBuilder {
    this.orderLineDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IOrderLineDtoBuilder {
    this.orderLineDto.updatedAt = at
    return this
  }

  setPaginationKey (key: UUID): IOrderLineDtoBuilder {
    this.orderLineDto.paginationKey = key
    return this
  }

  build (): OrderLineDto {
    const result = this.orderLineDto
    this.reset()
    return result
  }
}
