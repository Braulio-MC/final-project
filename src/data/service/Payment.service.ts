import { inject, singleton } from 'tsyringe'
import PaymentDto from '../dto/PaymentDto'
import Payment from '../model/Payment'
import IService from './IService'
import IPaymentRepository from '../repository/payment/IPaymentRepository'
import mapper from '../../core/Mapper'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'

@singleton()
export default class PaymentService implements IService<PaymentDto, Payment> {
  constructor (
    @inject('PaymentRepository') private readonly repository: IPaymentRepository
  ) {}

  async create (item: PaymentDto): Promise<void> {
    await this.repository.create(item)
  }

  async update (id: string, item: Partial<PaymentDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Payment>> {
    const result = await this.repository.paging(limit, after, before)
    const pagignResult: PagingResult<Payment> = {
      data: result.data.map(dto => mapper.map<PaymentDto, Payment>(dto, 'PaymentDto', 'Payment')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }

  async findById (id: string): Promise<Payment | null> {
    const result = await this.repository.findById(id)
    if (result != null) {
      return mapper.map<PaymentDto, Payment>(result, 'PaymentDto', 'Payment')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Payment>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const pagignResult: PagingResult<Payment> = {
      data: result.data.map(dto => mapper.map<PaymentDto, Payment>(dto, 'PaymentDto', 'Payment')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }
}
