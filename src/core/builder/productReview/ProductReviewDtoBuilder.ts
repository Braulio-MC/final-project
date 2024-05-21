import { Timestamp } from 'firebase-admin/firestore'
import ProductReviewDto from '../../../data/dto/ProductReviewDto'
import IProductReviewDtoBuilder from './IProductReviewDtoBuilder'
import { UUID } from 'crypto'

export default class ProductReviewDtoBuilder implements IProductReviewDtoBuilder {
  private productReviewDto!: ProductReviewDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetProductReview: ProductReviewDto = {
      id: undefined,
      userId: undefined,
      productId: undefined,
      rating: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      paginationKey: undefined
    }
    this.productReviewDto = resetProductReview
  }

  setUserId (id: string): IProductReviewDtoBuilder {
    this.productReviewDto.userId = id
    return this
  }

  setProductId (id: string): IProductReviewDtoBuilder {
    this.productReviewDto.productId = id
    return this
  }

  setRating (rating: number): IProductReviewDtoBuilder {
    this.productReviewDto.rating = rating
    return this
  }

  setCreatedAt (at: Timestamp): IProductReviewDtoBuilder {
    this.productReviewDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IProductReviewDtoBuilder {
    this.productReviewDto.updatedAt = at
    return this
  }

  setPaginationKey (key: UUID): IProductReviewDtoBuilder {
    this.productReviewDto.paginationKey = key
    return this
  }

  build (): ProductReviewDto {
    const result = this.productReviewDto
    this.reset()
    return result
  }
}
