import { UUID } from 'crypto'
import StoreReviewDto from '../../../data/dto/StoreReviewDto'
import IStoreReviewDtoBuilder from './IStoreReviewDtoBuilder'

export default class StoreReviewDtoBuilder implements IStoreReviewDtoBuilder {
  private storeReviewDto!: StoreReviewDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetStoreReviewDto: StoreReviewDto = {
      id: undefined,
      userId: undefined,
      storeId: undefined,
      rating: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      paginationKey: undefined
    }
    this.storeReviewDto = resetStoreReviewDto
  }

  setUserId (id: string): IStoreReviewDtoBuilder {
    this.storeReviewDto.userId = id
    return this
  }

  setStoreId (id: string): IStoreReviewDtoBuilder {
    this.storeReviewDto.storeId = id
    return this
  }

  setRating (rating: number): IStoreReviewDtoBuilder {
    this.storeReviewDto.rating = rating
    return this
  }

  setCreatedAt (at: FirebaseFirestore.Timestamp): IStoreReviewDtoBuilder {
    this.storeReviewDto.createdAt = at
    return this
  }

  setUpdatedAt (at: FirebaseFirestore.Timestamp): IStoreReviewDtoBuilder {
    this.storeReviewDto.updatedAt = at
    return this
  }

  setPaginationKey (key: UUID): IStoreReviewDtoBuilder {
    this.storeReviewDto.paginationKey = key
    return this
  }

  build (): StoreReviewDto {
    const result = this.storeReviewDto
    this.reset()
    return result
  }
}
