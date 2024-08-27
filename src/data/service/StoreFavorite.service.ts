import { inject, singleton } from 'tsyringe'
import IService from './IService'
import mapper from '../../core/Mapper'
import Criteria from '../../core/criteria/Criteria'
import StoreFavoriteDto from '../dto/StoreFavoriteDto'
import StoreFavorite from '../model/StoreFavorite'
import IStoreFavoriteRepository from '../repository/storefavorite/IStoreFavoriteRepository'
import { PagingResult } from '../../types'
import RedisRepository from '../persistance/redis/RedisRepository'
import StoreFavoriteRedis from '../persistance/redis/model/StoreFavoriteRedis'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class StoreFavoriteService implements IService<StoreFavoriteDto, StoreFavorite> {
  constructor (
    @inject('StoreFavoriteRepository') private readonly repository: IStoreFavoriteRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: StoreFavoriteDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<StoreFavoriteDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<StoreFavorite>> {
    const cachedKey = `storefavorite_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<StoreFavoriteRedis>>(cachedKey)
    if (cachedResult != null) {
      const storeFavorites = cachedResult.data.map(dto => mapper.map<StoreFavoriteRedis, StoreFavorite>(dto, 'StoreFavoriteRedis', 'StoreFavorite'))
      const pagingResult: PagingResult<StoreFavorite> = {
        data: storeFavorites,
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<StoreFavoriteRedis> = {
      data: result.data.map(dto => mapper.map<StoreFavoriteDto, StoreFavoriteRedis>(dto, 'StoreFavoriteDto', 'StoreFavoriteRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<StoreFavorite> = {
      data: result.data.map(dto => mapper.map<StoreFavoriteDto, StoreFavorite>(dto, 'StoreFavoriteDto', 'StoreFavorite')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string): Promise<StoreFavorite | null> {
    const cachedKey = `storefavorite_pagingById_${id}`
    const cachedResult = await this.redisRepository.get<StoreFavoriteRedis>(cachedKey)
    if (cachedResult != null) {
      console.log('returning from cache')
      return mapper.map<StoreFavoriteRedis, StoreFavorite>(cachedResult, 'StoreFavoriteRedis', 'StoreFavorite')
    }
    const result = await this.repository.findById(id)
    if (result !== null) {
      const cacheValue = mapper.map<StoreFavoriteDto, StoreFavoriteRedis>(result, 'StoreFavoriteDto', 'StoreFavoriteRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      console.log('returning from db')
      return mapper.map<StoreFavoriteDto, StoreFavorite>(result, 'StoreFavoriteDto', 'StoreFavorite')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<StoreFavorite>> {
    const cachedKey = `storefavorite_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<StoreFavoriteRedis>>(cachedKey)
    if (cachedResult != null) {
      const storeFavorites = cachedResult.data.map(dto => mapper.map<StoreFavoriteRedis, StoreFavorite>(dto, 'StoreFavoriteRedis', 'StoreFavorite'))
      const pagingResult: PagingResult<StoreFavorite> = {
        data: storeFavorites,
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<StoreFavoriteRedis> = {
      data: result.data.map(dto => mapper.map<StoreFavoriteDto, StoreFavoriteRedis>(dto, 'StoreFavoriteDto', 'StoreFavoriteRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<StoreFavorite> = {
      data: result.data.map(dto => mapper.map<StoreFavoriteDto, StoreFavorite>(dto, 'StoreFavoriteDto', 'StoreFavorite')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
