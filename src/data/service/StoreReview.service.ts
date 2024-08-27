import { inject, singleton } from 'tsyringe'
import IService from './IService'
import mapper from '../../core/Mapper'
import Criteria from '../../core/criteria/Criteria'
import StoreReviewDto from '../dto/StoreReviewDto'
import StoreReview from '../model/StoreReview'
import IStoreReviewRepository from '../repository/storereview/IStoreReviewRepository'
import { PagingResult } from '../../types'
import RedisRepository from '../persistance/redis/RedisRepository'
import StoreReviewRedis from '../persistance/redis/model/StoreReviewRedis'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class StoreReviewService implements IService<StoreReviewDto, StoreReview> {
  constructor (
    @inject('StoreReviewRepository') private readonly repository: IStoreReviewRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: StoreReviewDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<StoreReviewDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<StoreReview>> {
    const cachedKey = `storereview_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<StoreReviewRedis>>(cachedKey)
    if (cachedResult != null) {
      const storeReviews = cachedResult.data.map(dto => mapper.map<StoreReviewRedis, StoreReview>(dto, 'StoreReviewRedis', 'StoreReview'))
      const pagingResult: PagingResult<StoreReview> = {
        data: storeReviews,
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<StoreReviewRedis> = {
      data: result.data.map(dto => mapper.map<StoreReviewDto, StoreReviewRedis>(dto, 'StoreReviewDto', 'StoreReviewRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<StoreReview> = {
      data: result.data.map(dto => mapper.map<StoreReviewDto, StoreReview>(dto, 'StoreReviewDto', 'StoreReview')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string): Promise<StoreReview | null> {
    const cachedKey = `storereview_pagingById_${id}`
    const cachedResult = await this.redisRepository.get<StoreReviewRedis>(cachedKey)
    if (cachedResult != null) {
      console.log('returning from cache')
      return mapper.map<StoreReviewRedis, StoreReview>(cachedResult, 'StoreReviewRedis', 'StoreReview')
    }
    const result = await this.repository.findById(id)
    if (result !== null) {
      const cacheValue = mapper.map<StoreReviewDto, StoreReviewRedis>(result, 'StoreReviewDto', 'StoreReviewRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      console.log('returning from db')
      return mapper.map<StoreReviewDto, StoreReview>(result, 'StoreReviewDto', 'StoreReview')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<StoreReview>> {
    const cachedKey = `storereview_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<StoreReviewRedis>>(cachedKey)
    if (cachedResult != null) {
      const storeReviews = cachedResult.data.map(dto => mapper.map<StoreReviewRedis, StoreReview>(dto, 'StoreReviewRedis', 'StoreReview'))
      const pagingResult: PagingResult<StoreReview> = {
        data: storeReviews,
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<StoreReviewRedis> = {
      data: result.data.map(dto => mapper.map<StoreReviewDto, StoreReviewRedis>(dto, 'StoreReviewDto', 'StoreReviewRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<StoreReview> = {
      data: result.data.map(dto => mapper.map<StoreReviewDto, StoreReview>(dto, 'StoreReviewDto', 'StoreReview')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
