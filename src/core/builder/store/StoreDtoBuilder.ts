import { Timestamp } from 'firebase-admin/firestore'
import StoreDto from '../../../data/dto/StoreDto'
import IStoreDtoBuilder from './IStoreDtoBuilder'
import { UUID } from 'crypto'

export default class StoreDtoBuilder implements IStoreDtoBuilder {
  private storeDto!: StoreDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetStoreDto: StoreDto = {
      id: undefined,
      name: undefined,
      description: undefined,
      email: undefined,
      image: undefined,
      phoneNumber: undefined,
      userId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      paginationKey: undefined
    }
    this.storeDto = resetStoreDto
  }

  setName (name: string): IStoreDtoBuilder {
    this.storeDto.name = name
    return this
  }

  setDescription (description: string): IStoreDtoBuilder {
    this.storeDto.description = description
    return this
  }

  setEmail (email: string): IStoreDtoBuilder {
    this.storeDto.email = email
    return this
  }

  setPhoneNumber (phoneNumber: string): IStoreDtoBuilder {
    this.storeDto.phoneNumber = phoneNumber
    return this
  }

  setImage (image: URL): IStoreDtoBuilder {
    this.storeDto.image = image
    return this
  }

  setUserId (id: string): IStoreDtoBuilder {
    this.storeDto.userId = id
    return this
  }

  setCreatedAt (at: Timestamp): IStoreDtoBuilder {
    this.storeDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IStoreDtoBuilder {
    this.storeDto.updatedAt = at
    return this
  }

  setPaginationKey (key: UUID): IStoreDtoBuilder {
    this.storeDto.paginationKey = key
    return this
  }

  build (): StoreDto {
    const result = this.storeDto
    this.reset()
    return result
  }
}
