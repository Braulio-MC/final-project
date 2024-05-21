import { inject, singleton } from 'tsyringe'
import IService from './IService'
import mapper from '../../core/Mapper'
import Criteria from '../../core/criteria/Criteria'
import StoreReviewDto from '../dto/StoreReviewDto'
import StoreReview from '../model/StoreReview'
import IStoreReviewRepository from '../repository/storeReview/IStoreReviewRepository'
import { PagingResult } from '../../types'

@singleton()
export default class StoreReviewService implements IService<StoreReviewDto, StoreReview> {
  constructor (
    @inject('StoreReviewRepository') private readonly repository: IStoreReviewRepository
  ) {}

  async create (item: StoreReviewDto): Promise<void> {
    await this.repository.create(item)
  }

  async update (id: string, item: Partial<StoreReviewDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<StoreReview>> {
    const result = await this.repository.paging(limit, after, before)
    const pagignResult: PagingResult<StoreReview> = {
      data: result.data.map(dto => mapper.map<StoreReviewDto, StoreReview>(dto, 'StoreReviewDto', 'StoreReview')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }

  async findById (id: string): Promise<StoreReview | null> {
    const result = await this.repository.findById(id)
    if (result !== null) {
      return mapper.map<StoreReviewDto, StoreReview>(result, 'StoreReviewDto', 'StoreReview')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<StoreReview>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const pagignResult: PagingResult<StoreReview> = {
      data: result.data.map(dto => mapper.map<StoreReviewDto, StoreReview>(dto, 'StoreReviewDto', 'StoreReview')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }
}
