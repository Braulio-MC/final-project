import { Timestamp } from 'firebase-admin/firestore'
import DeliveryLocationDto from '../../../data/dto/DeliveryLocationDto'
import IDeliveryLocationDtoBuilder from './IDeliveryLocationDtoBuilder'
import { UUID } from 'crypto'

export default class DeliveryLocationDtoBuilder implements IDeliveryLocationDtoBuilder {
  private deliveryLocationDto!: DeliveryLocationDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetDeliveryLocationDto: DeliveryLocationDto = {
      id: undefined,
      name: undefined,
      description: undefined,
      storeId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      paginationKey: undefined
    }
    this.deliveryLocationDto = resetDeliveryLocationDto
  }

  setName (name: string): IDeliveryLocationDtoBuilder {
    this.deliveryLocationDto.name = name
    return this
  }

  setDescription (description: string): IDeliveryLocationDtoBuilder {
    this.deliveryLocationDto.description = description
    return this
  }

  setStoreID (id: string): IDeliveryLocationDtoBuilder {
    this.deliveryLocationDto.storeId = id
    return this
  }

  setCreatedAt (at: Timestamp): IDeliveryLocationDtoBuilder {
    this.deliveryLocationDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IDeliveryLocationDtoBuilder {
    this.deliveryLocationDto.updatedAt = at
    return this
  }

  setPaginationKey (key: UUID): IDeliveryLocationDtoBuilder {
    this.deliveryLocationDto.paginationKey = key
    return this
  }

  build (): DeliveryLocationDto {
    const result = this.deliveryLocationDto
    this.reset()
    return result
  }
}
