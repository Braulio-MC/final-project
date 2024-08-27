import { UUID } from 'crypto'
import ShoppingCartProductDto from '../../../data/dto/ShoppingCartProductDto'
import IShoppingCartProductDtoBuilder from './IShoppingCartItemDtoBuilder'
import { Timestamp } from 'firebase-admin/firestore'

export default class ShoppingCartItemDtoBuilder implements IShoppingCartProductDtoBuilder {
  private shoppingCartProductDto!: ShoppingCartProductDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetShoppingCartProductDto: ShoppingCartProductDto = {
      objectId: undefined,
      id: undefined,
      name: undefined,
      image: undefined,
      price: undefined,
      quantity: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      paginationKey: undefined
    }
    this.shoppingCartProductDto = resetShoppingCartProductDto
  }

  setProductId (id: string): IShoppingCartProductDtoBuilder {
    this.shoppingCartProductDto.id = id
    return this
  }

  setProductName (name: string): IShoppingCartProductDtoBuilder {
    this.shoppingCartProductDto.name = name
    return this
  }

  setProductImage (image: string): IShoppingCartProductDtoBuilder {
    this.shoppingCartProductDto.image = image
    return this
  }

  setProductPrice (price: number): IShoppingCartProductDtoBuilder {
    this.shoppingCartProductDto.price = price
    return this
  }

  setQuantity (quantity: number): IShoppingCartProductDtoBuilder {
    this.shoppingCartProductDto.quantity = quantity
    return this
  }

  setCreatedAt (at: Timestamp): IShoppingCartProductDtoBuilder {
    this.shoppingCartProductDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IShoppingCartProductDtoBuilder {
    this.shoppingCartProductDto.updatedAt = at
    return this
  }

  setPaginationKey (key: UUID): IShoppingCartProductDtoBuilder {
    this.shoppingCartProductDto.paginationKey = key
    return this
  }

  build (): ShoppingCartProductDto {
    const result = this.shoppingCartProductDto
    this.reset()
    return result
  }
}
