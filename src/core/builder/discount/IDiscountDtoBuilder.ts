import { Timestamp } from 'firebase-admin/firestore'
import DiscountDto from '../../../data/dto/DiscountDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IDiscountDtoBuilder extends IBaseBuilder<IDiscountDtoBuilder, DiscountDto> {
  setPercentage: (percentage: number) => IDiscountDtoBuilder
  setStartDate: (startDate: Timestamp) => IDiscountDtoBuilder
  setEndDate: (endDate: Timestamp) => IDiscountDtoBuilder
  setStoreId: (id: string) => IDiscountDtoBuilder
}
