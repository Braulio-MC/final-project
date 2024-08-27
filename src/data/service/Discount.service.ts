import { inject, singleton } from 'tsyringe'
import DiscountDto from '../dto/DiscountDto'
import IService from './IService'
import Discount from '../model/Discount'
import mapper from '../../core/Mapper'
import IDiscountRepository from '../repository/discount/IDiscountRepository'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'
import RedisRepository from '../persistance/redis/RedisRepository'
import DiscountRedis from '../persistance/redis/model/DiscountRedis'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class DiscountService implements IService<DiscountDto, Discount> {
  constructor (
    @inject('DiscountRepository') private readonly repository: IDiscountRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: DiscountDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<DiscountDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Discount>> {
    const cachedKey = `discount_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<DiscountRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<Discount> = {
        data: cachedResult.data.map(dto => mapper.map<DiscountRedis, Discount>(dto, 'DiscountRedis', 'Discount')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<DiscountRedis> = {
      data: result.data.map(dto => mapper.map<DiscountDto, DiscountRedis>(dto, 'DiscountDto', 'DiscountRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<Discount> = {
      data: result.data.map(dto => mapper.map<DiscountDto, Discount>(dto, 'DiscountDto', 'Discount')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string): Promise<Discount | null> {
    const cachedKey = `discount_findById_${id}`
    const cachedResult = await this.redisRepository.get<DiscountRedis>(cachedKey)
    if (cachedResult != null) {
      console.log('returning from cache')
      return mapper.map<DiscountRedis, Discount>(cachedResult, 'DiscountRedis', 'Discount')
    }
    const result = await this.repository.findById(id)
    if (result !== null) {
      const cacheValue = mapper.map<DiscountDto, DiscountRedis>(result, 'DiscountDto', 'DiscountRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      console.log('returning from db')
      return mapper.map<DiscountDto, Discount>(result, 'DiscountDto', 'Discount')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Discount>> {
    const cachedKey = `discount_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<DiscountRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<Discount> = {
        data: cachedResult.data.map(dto => mapper.map<DiscountRedis, Discount>(dto, 'DiscountRedis', 'Discount')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<DiscountRedis> = {
      data: result.data.map(dto => mapper.map<DiscountDto, DiscountRedis>(dto, 'DiscountDto', 'DiscountRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<Discount> = {
      data: result.data.map(dto => mapper.map<DiscountDto, Discount>(dto, 'DiscountDto', 'Discount')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
