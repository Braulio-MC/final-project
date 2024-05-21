import { inject, singleton } from 'tsyringe'
import IService from './IService'
import mapper from '../../core/Mapper'
import Criteria from '../../core/criteria/Criteria'
import StoreFavoriteDto from '../dto/StoreFavoriteDto'
import StoreFavorite from '../model/StoreFavorite'
import IStoreFavoriteRepository from '../repository/storeFavorite/IStoreFavoriteRepository'
import { PagingResult } from '../../types'

@singleton()
export default class StoreFavoriteService implements IService<StoreFavoriteDto, StoreFavorite> {
  constructor (
    @inject('StoreFavoriteRepository') private readonly repository: IStoreFavoriteRepository
  ) {}

  async create (item: StoreFavoriteDto): Promise<void> {
    await this.repository.create(item)
  }

  async update (id: string, item: Partial<StoreFavoriteDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<StoreFavorite>> {
    const result = await this.repository.paging(limit, after, before)
    const pagignResult: PagingResult<StoreFavorite> = {
      data: result.data.map(dto => mapper.map<StoreFavoriteDto, StoreFavorite>(dto, 'StoreFavoriteDto', 'StoreFavorite')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }

  async findById (id: string): Promise<StoreFavorite | null> {
    const result = await this.repository.findById(id)
    if (result !== null) {
      return mapper.map<StoreFavoriteDto, StoreFavorite>(result, 'StoreFavoriteDto', 'StoreFavorite')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<StoreFavorite>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const pagignResult: PagingResult<StoreFavorite> = {
      data: result.data.map(dto => mapper.map<StoreFavoriteDto, StoreFavorite>(dto, 'StoreFavoriteDto', 'StoreFavorite')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }
}
