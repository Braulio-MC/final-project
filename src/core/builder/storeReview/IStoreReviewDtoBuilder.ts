import StoreReviewDto from '../../../data/dto/StoreReviewDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IStoreReviewDtoBuilder extends IBaseBuilder<IStoreReviewDtoBuilder, StoreReviewDto> {
  setUserId: (id: string) => IStoreReviewDtoBuilder
  setStoreId: (id: string) => IStoreReviewDtoBuilder
  setRating: (rating: number) => IStoreReviewDtoBuilder
}
