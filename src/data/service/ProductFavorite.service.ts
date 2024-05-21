import { inject, singleton } from 'tsyringe'
import IService from './IService'
import mapper from '../../core/Mapper'
import ProductFavoriteDto from '../dto/ProductFavoriteDto'
import ProductFavorite from '../model/ProductFavorite'
import IProductFavoriteRepository from '../repository/productFavorite/IProductFavoriteRepository'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'

@singleton()
export default class ProductFavoriteService implements IService<ProductFavoriteDto, ProductFavorite> {
  constructor (
    @inject('ProductFavoriteRepository') private readonly repository: IProductFavoriteRepository
  ) {}

  async create (item: ProductFavoriteDto): Promise<void> {
    await this.repository.create(item)
  }

  async update (id: string, item: Partial<ProductFavoriteDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<ProductFavorite>> {
    const result = await this.repository.paging(limit, after, before)
    const pagignResult: PagingResult<ProductFavorite> = {
      data: result.data.map(dto => mapper.map<ProductFavoriteDto, ProductFavorite>(dto, 'ProductFavoriteDto', 'ProductFavorite')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }

  async findById (id: string): Promise<ProductFavorite | null> {
    const result = await this.repository.findById(id)
    if (result !== null) {
      return mapper.map<ProductFavoriteDto, ProductFavorite>(result, 'ProductFavoriteDto', 'ProductFavorite')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<ProductFavorite>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const pagignResult: PagingResult<ProductFavorite> = {
      data: result.data.map(dto => mapper.map<ProductFavoriteDto, ProductFavorite>(dto, 'ProductFavoriteDto', 'ProductFavorite')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }
}
