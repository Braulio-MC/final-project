import { inject, singleton } from 'tsyringe'
import ProductReviewDto from '../dto/ProductReviewDto'
import ProductReview from '../model/ProductReview'
import IProductReviewRepository from '../repository/productReview/IProductReviewRepository'
import IService from './IService'
import mapper from '../../core/Mapper'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'

@singleton()
export default class ProductReviewService implements IService<ProductReviewDto, ProductReview> {
  constructor (
    @inject('ProductReviewRepository') private readonly repository: IProductReviewRepository
  ) {}

  async create (item: ProductReviewDto): Promise<void> {
    await this.repository.create(item)
  }

  async update (id: string, item: Partial<ProductReviewDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<ProductReview>> {
    const result = await this.repository.paging(limit, after, before)
    const pagignResult: PagingResult<ProductReview> = {
      data: result.data.map(dto => mapper.map<ProductReviewDto, ProductReview>(dto, 'ProductReviewDto', 'ProductReview')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }

  async findById (id: string): Promise<ProductReview | null> {
    const result = await this.repository.findById(id)
    if (result !== null) {
      return mapper.map<ProductReviewDto, ProductReview>(result, 'ProductReviewDto', 'ProductReview')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<ProductReview>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const pagignResult: PagingResult<ProductReview> = {
      data: result.data.map(dto => mapper.map<ProductReviewDto, ProductReview>(dto, 'ProductReviewDto', 'ProductReview')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }
}
