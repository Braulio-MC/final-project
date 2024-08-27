import { Timestamp } from 'firebase-admin/firestore'
import StoreFavoriteDto from '../../../data/dto/StoreFavoriteDto'
import IStoreFavoriteDtoBuilder from './IStoreFavoriteDtoBuilder'
import { UUID } from 'crypto'

export default class StoreFavoriteDtoBuilder implements IStoreFavoriteDtoBuilder {
  private storeFavoriteDto!: StoreFavoriteDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetStoreFavoriteDto: StoreFavoriteDto = {
      id: undefined,
      userId: undefined,
      storeId: undefined,
      name: undefined,
      description: undefined,
      email: undefined,
      image: undefined,
      phoneNumber: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      paginationKey: undefined
    }
    this.storeFavoriteDto = resetStoreFavoriteDto
  }

  setUserId (id: string): IStoreFavoriteDtoBuilder {
    this.storeFavoriteDto.userId = id
    return this
  }

  setStoreId (id: string): IStoreFavoriteDtoBuilder {
    this.storeFavoriteDto.storeId = id
    return this
  }

  setName (name: string): IStoreFavoriteDtoBuilder {
    this.storeFavoriteDto.name = name
    return this
  }

  setImage (image: string): IStoreFavoriteDtoBuilder {
    this.storeFavoriteDto.image = image
    return this
  }

  setDescription (description: string): IStoreFavoriteDtoBuilder {
    this.storeFavoriteDto.description = description
    return this
  }

  setEmail (email: string): IStoreFavoriteDtoBuilder {
    this.storeFavoriteDto.email = email
    return this
  }

  setPhoneNumber (phoneNumber: string): IStoreFavoriteDtoBuilder {
    this.storeFavoriteDto.phoneNumber = phoneNumber
    return this
  }

  setCreatedAt (at: Timestamp): IStoreFavoriteDtoBuilder {
    this.storeFavoriteDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IStoreFavoriteDtoBuilder {
    this.storeFavoriteDto.updatedAt = at
    return this
  }

  setPaginationKey (key: UUID): IStoreFavoriteDtoBuilder {
    this.storeFavoriteDto.paginationKey = key
    return this
  }

  build (): StoreFavoriteDto {
    const result = this.storeFavoriteDto
    this.reset()
    return result
  }
}
