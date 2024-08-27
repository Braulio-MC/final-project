import { inject, singleton } from 'tsyringe'
import CategoryDto from '../dto/CategoryDto'
import Category from '../model/Category'
import mapper from '../../core/Mapper'
import IService from './IService'
import ICategoryRepository from '../repository/category/ICategoryRepository'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'
import RedisRepository from '../persistance/redis/RedisRepository'
import CategoryRedis from '../persistance/redis/model/CategoryRedis'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class CategoryService implements IService<CategoryDto, Category> {
  constructor (
    @inject('CategoryRepository') private readonly repository: ICategoryRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: CategoryDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<CategoryDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Category>> {
    const cachedKey = `category_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<CategoryRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<Category> = {
        data: cachedResult.data.map(dto => mapper.map<CategoryRedis, Category>(dto, 'CategoryRedis', 'Category')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<CategoryRedis> = {
      data: result.data.map(dto => mapper.map<CategoryDto, CategoryRedis>(dto, 'CategoryDto', 'CategoryRedis')),
      pagination: {
        prev: result.pagination.next,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<Category> = {
      data: result.data.map(dto => mapper.map<CategoryDto, Category>(dto, 'CategoryDto', 'Category')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagingResult
  }

  async findById (id: string): Promise<Category | null> {
    const cachedKey = `category_findById_${id}`
    const cachedResult = await this.redisRepository.get<CategoryRedis>(cachedKey)
    if (cachedResult != null) {
      return mapper.map<CategoryRedis, Category>(cachedResult, 'CategoryRedis', 'Category')
    }
    const result = await this.repository.findById(id)
    if (result !== null) {
      const cacheValue = mapper.map<CategoryDto, CategoryRedis>(result, 'CategoryDto', 'CategoryRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      return mapper.map<CategoryDto, Category>(result, 'CategoryDto', 'Category')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Category>> {
    const cachedKey = `category_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<CategoryRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<Category> = {
        data: cachedResult.data.map(dto => mapper.map<CategoryRedis, Category>(dto, 'CategoryRedis', 'Category')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<CategoryRedis> = {
      data: result.data.map(dto => mapper.map<CategoryDto, CategoryRedis>(dto, 'CategoryDto', 'CategoryRedis')),
      pagination: {
        prev: result.pagination.next,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<Category> = {
      data: result.data.map(dto => mapper.map<CategoryDto, Category>(dto, 'CategoryDto', 'Category')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
