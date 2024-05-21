import { inject, singleton } from 'tsyringe'
import CategoryDto from '../dto/CategoryDto'
import Category from '../model/Category'
import mapper from '../../core/Mapper'
import IService from './IService'
import ICategoryRepository from '../repository/category/ICategoryRepository'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'

@singleton()
export default class CategoryService implements IService<CategoryDto, Category> {
  constructor (
    @inject('CategoryRepository') private readonly repository: ICategoryRepository
  ) {}

  async create (item: CategoryDto): Promise<void> {
    await this.repository.create(item)
  }

  async update (id: string, item: Partial<CategoryDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Category>> {
    const result = await this.repository.paging(limit, after, before)
    const pagignResult: PagingResult<Category> = {
      data: result.data.map(dto => mapper.map<CategoryDto, Category>(dto, 'CategoryDto', 'Category')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }

  async findById (id: string): Promise<Category | null> {
    const result = await this.repository.findById(id)
    if (result !== null) {
      return mapper.map<CategoryDto, Category>(result, 'CategoryDto', 'Category')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Category>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const pagignResult: PagingResult<Category> = {
      data: result.data.map(dto => mapper.map<CategoryDto, Category>(dto, 'CategoryDto', 'Category')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }
}
