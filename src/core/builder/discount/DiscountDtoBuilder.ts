import { UUID } from 'crypto'
import DiscountDto from '../../../data/dto/DiscountDto'
import IDiscountDtoBuilder from './IDiscountDtoBuilder'

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

  setStartDate (startDate: FirebaseFirestore.Timestamp): IDiscountDtoBuilder {
    this.discountDto.startDate = startDate
    return this
  }

  setEndDate (endDate: FirebaseFirestore.Timestamp): IDiscountDtoBuilder {
    this.discountDto.endDate = endDate
    return this
  }

  setStoreId (id: string): IDiscountDtoBuilder {
    this.discountDto.storeId = id
    return this
  }

  setCreatedAt (at: FirebaseFirestore.Timestamp): IDiscountDtoBuilder {
    this.discountDto.createdAt = at
    return this
  }

  setUpdatedAt (at: FirebaseFirestore.Timestamp): IDiscountDtoBuilder {
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
