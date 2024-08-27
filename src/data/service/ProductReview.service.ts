import { inject, singleton } from 'tsyringe'
import ProductReviewDto from '../dto/ProductReviewDto'
import ProductReview from '../model/ProductReview'
import IProductReviewRepository from '../repository/productreview/IProductReviewRepository'
import IService from './IService'
import mapper from '../../core/Mapper'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'
import RedisRepository from '../persistance/redis/RedisRepository'
import ProductReviewRedis from '../persistance/redis/model/ProductReviewRedis'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class ProductReviewService implements IService<ProductReviewDto, ProductReview> {
  constructor (
    @inject('ProductReviewRepository') private readonly repository: IProductReviewRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: ProductReviewDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<ProductReviewDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<ProductReview>> {
    const cachedKey = `productreview_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<ProductReviewRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<ProductReview> = {
        data: cachedResult.data.map(dto => mapper.map<ProductReviewRedis, ProductReview>(dto, 'ProductReviewRedis', 'ProductReview')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<ProductReviewRedis> = {
      data: result.data.map(dto => mapper.map<ProductReviewDto, ProductReviewRedis>(dto, 'ProductReviewDto', 'ProductReviewRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<ProductReview> = {
      data: result.data.map(dto => mapper.map<ProductReviewDto, ProductReview>(dto, 'ProductReviewDto', 'ProductReview')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string): Promise<ProductReview | null> {
    const cachedKey = `productreview_findById_${id}`
    const cachedResult = await this.redisRepository.get<ProductReviewRedis>(cachedKey)
    if (cachedResult != null) {
      console.log('returning from cache')
      return mapper.map<ProductReviewRedis, ProductReview>(cachedResult, 'ProductReviewRedis', 'ProductReview')
    }
    const result = await this.repository.findById(id)
    if (result !== null) {
      const cacheValue = mapper.map<ProductReviewDto, ProductReviewRedis>(result, 'ProductReviewDto', 'ProductReviewRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      console.log('returning from db')
      return mapper.map<ProductReviewDto, ProductReview>(result, 'ProductReviewDto', 'ProductReview')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<ProductReview>> {
    const cachedKey = `productreview_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<ProductReviewRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<ProductReview> = {
        data: cachedResult.data.map(dto => mapper.map<ProductReviewRedis, ProductReview>(dto, 'ProductReviewRedis', 'ProductReview')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<ProductReviewRedis> = {
      data: result.data.map(dto => mapper.map<ProductReviewDto, ProductReviewRedis>(dto, 'ProductReviewDto', 'ProductReviewRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<ProductReview> = {
      data: result.data.map(dto => mapper.map<ProductReviewDto, ProductReview>(dto, 'ProductReviewDto', 'ProductReview')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
