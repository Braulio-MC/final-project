import { inject, singleton } from 'tsyringe'
import DiscountDto from '../dto/DiscountDto'
import IService from './IService'
import Discount from '../model/Discount'
import mapper from '../../core/Mapper'
import IDiscountRepository from '../repository/discount/IDiscountRepository'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'

@singleton()
export default class DiscountService implements IService<DiscountDto, Discount> {
  constructor (
    @inject('DiscountRepository') private readonly repository: IDiscountRepository
  ) {}

  async create (item: DiscountDto): Promise<void> {
    await this.repository.create(item)
  }

  async update (id: string, item: Partial<DiscountDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Discount>> {
    const result = await this.repository.paging(limit, after, before)
    const pagignResult: PagingResult<Discount> = {
      data: result.data.map(dto => mapper.map<DiscountDto, Discount>(dto, 'DiscountDto', 'Discount')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }

  async findById (id: string): Promise<Discount | null> {
    const result = await this.repository.findById(id)
    if (result !== null) {
      return mapper.map<DiscountDto, Discount>(result, 'DiscountDto', 'Discount')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Discount>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const pagignResult: PagingResult<Discount> = {
      data: result.data.map(dto => mapper.map<DiscountDto, Discount>(dto, 'DiscountDto', 'Discount')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }
}
