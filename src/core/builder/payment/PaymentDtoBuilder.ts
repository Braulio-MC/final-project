import { Timestamp } from 'firebase-admin/firestore'
import PaymentDto from '../../../data/dto/PaymentDto'
import IPaymentDtoBuilder from './IPaymentDtoBuilder'
import { UUID } from 'crypto'

export default class PaymentDtoBuilder implements IPaymentDtoBuilder {
  private PaymentDto!: PaymentDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetPaymentDto: PaymentDto = {
      id: undefined,
      name: undefined,
      description: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      paginationKey: undefined
    }
    this.PaymentDto = resetPaymentDto
  }

  setName (name: string): IPaymentDtoBuilder {
    this.PaymentDto.name = name
    return this
  }

  setDescription (description: string): IPaymentDtoBuilder {
    this.PaymentDto.description = description
    return this
  }

  setCreatedAt (at: Timestamp): IPaymentDtoBuilder {
    this.PaymentDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IPaymentDtoBuilder {
    this.PaymentDto.updatedAt = at
    return this
  }

  setPaginationKey (key: UUID): IPaymentDtoBuilder {
    this.PaymentDto.paginationKey = key
    return this
  }

  build (): PaymentDto {
    const result = this.PaymentDto
    this.reset()
    return result
  }
}
