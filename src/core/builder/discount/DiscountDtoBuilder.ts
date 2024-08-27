import { UUID } from 'crypto'
import DiscountDto from '../../../data/dto/DiscountDto'
import IDiscountDtoBuilder from './IDiscountDtoBuilder'
import { Timestamp } from 'firebase-admin/firestore'

export default class DiscountDtoBuilder implements IDiscountDtoBuilder {
  private discountDto!: DiscountDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetDiscountDto: DiscountDto = {
      id: undefined,
      percentage: undefined,
      startDate: undefined,
      endDate: undefined,
      storeId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      paginationKey: undefined
    }
    this.discountDto = resetDiscountDto
  }

  setPercentage (percentage: number): IDiscountDtoBuilder {
    this.discountDto.percentage = percentage
    return this
  }

  setStartDate (startDate: Timestamp): IDiscountDtoBuilder {
    this.discountDto.startDate = startDate
    return this
  }

  setEndDate (endDate: Timestamp): IDiscountDtoBuilder {
    this.discountDto.endDate = endDate
    return this
  }

  setStoreId (id: string): IDiscountDtoBuilder {
    this.discountDto.storeId = id
    return this
  }

  setCreatedAt (at: Timestamp): IDiscountDtoBuilder {
    this.discountDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IDiscountDtoBuilder {
    this.discountDto.updatedAt = at
    return this
  }

  setPaginationKey (key: UUID): IDiscountDtoBuilder {
    this.discountDto.paginationKey = key
    return this
  }

  build (): DiscountDto {
    const result = this.discountDto
    this.reset()
    return result
  }
}
