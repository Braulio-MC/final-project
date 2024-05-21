import ProductReviewDto from '../../../data/dto/ProductReviewDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IProductReviewDtoBuilder extends IBaseBuilder<IProductReviewDtoBuilder, ProductReviewDto> {
  setUserId: (id: string) => IProductReviewDtoBuilder
  setProductId: (id: string) => IProductReviewDtoBuilder
  setRating: (rating: number) => IProductReviewDtoBuilder
}
