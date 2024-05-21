import { Timestamp } from 'firebase-admin/firestore'
import ShoppingCartDto from '../../../data/dto/ShoppingCartDto'
import IShoppingCartDtoBuilder from './IShoppingCartDtoBuilder'
import { UUID } from 'crypto'

export default class ShoppingCartDtoBuilder implements IShoppingCartDtoBuilder {
  private shoppingCartDto!: ShoppingCartDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetShoppingCartDto: ShoppingCartDto = {
      id: undefined,
      userId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      store: {
        id: undefined,
        name: undefined
      },
      paginationKey: undefined
    }
    this.shoppingCartDto = resetShoppingCartDto
  }

  setUserId (id: string): IShoppingCartDtoBuilder {
    this.shoppingCartDto.userId = id
    return this
  }

  setCreatedAt (at: Timestamp): IShoppingCartDtoBuilder {
    this.shoppingCartDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IShoppingCartDtoBuilder {
    this.shoppingCartDto.updatedAt = at
    return this
  }

  setStoreId (id: string): IShoppingCartDtoBuilder {
    this.shoppingCartDto.store.id = id
    return this
  }

  setStoreName (name: string): IShoppingCartDtoBuilder {
    this.shoppingCartDto.store.name = name
    return this
  }

  setPaginationKey (key: UUID): IShoppingCartDtoBuilder {
    this.shoppingCartDto.paginationKey = key
    return this
  }

  build (): ShoppingCartDto {
    const result = this.shoppingCartDto
    this.reset()
    return result
  }
}
