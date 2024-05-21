import PaymentDto from '../../../data/dto/PaymentDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IPaymentDtoBuilder extends IBaseBuilder<IPaymentDtoBuilder, PaymentDto> {
  setName: (name: string) => IPaymentDtoBuilder
  setDescription: (description: string) => IPaymentDtoBuilder
}
