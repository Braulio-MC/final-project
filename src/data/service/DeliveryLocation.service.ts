import { inject, singleton } from 'tsyringe'
import DeliveryLocationDto from '../dto/DeliveryLocationDto'
import DeliveryLocation from '../model/DeliveryLocation'
import mapper from '../../core/Mapper'
import IService from './IService'
import IDeliveryLocationRepository from '../repository/deliverylocation/IDeliveryLocationRepository'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'
import RedisRepository from '../persistance/redis/RedisRepository'
import DeliveryLocationRedis from '../persistance/redis/model/DeliveryLocationRedis'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class DeliveryLocationService implements IService<DeliveryLocationDto, DeliveryLocation> {
  constructor (
    @inject('DeliveryLocationRepository') private readonly repository: IDeliveryLocationRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: DeliveryLocationDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<DeliveryLocationDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<DeliveryLocation>> {
    const cachedKey = `deliverylocation_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<DeliveryLocationRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<DeliveryLocation> = {
        data: cachedResult.data.map(dto => mapper.map<DeliveryLocationRedis, DeliveryLocation>(dto, 'DeliveryLocationRedis', 'DeliveryLocation')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<DeliveryLocationRedis> = {
      data: result.data.map(dto => mapper.map<DeliveryLocationDto, DeliveryLocationRedis>(dto, 'DeliveryLocationDto', 'DeliveryLocationRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<DeliveryLocation> = {
      data: result.data.map(dto => mapper.map<DeliveryLocationDto, DeliveryLocation>(dto, 'DeliveryLocationDto', 'DeliveryLocation')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string): Promise<DeliveryLocation | null> {
    const cachedKey = `deliverylocation_findById_${id}`
    const cachedResult = await this.redisRepository.get<DeliveryLocationRedis>(cachedKey)
    if (cachedResult != null) {
      console.log('returning from cache')
      return mapper.map<DeliveryLocationRedis, DeliveryLocation>(cachedResult, 'DeliveryLocationRedis', 'DeliveryLocation')
    }
    const result = await this.repository.findById(id)
    if (result !== null) {
      const cacheValue = mapper.map<DeliveryLocationDto, DeliveryLocationRedis>(result, 'DeliveryLocationDto', 'DeliveryLocationRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      console.log('returning from db')
      return mapper.map<DeliveryLocationDto, DeliveryLocation>(result, 'DeliveryLocationDto', 'DeliveryLocation')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<DeliveryLocation>> {
    const cachedKey = `deliverylocation_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<DeliveryLocationRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<DeliveryLocation> = {
        data: cachedResult.data.map(dto => mapper.map<DeliveryLocationRedis, DeliveryLocation>(dto, 'DeliveryLocationRedis', 'DeliveryLocation')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<DeliveryLocationRedis> = {
      data: result.data.map(dto => mapper.map<DeliveryLocationDto, DeliveryLocationRedis>(dto, 'DeliveryLocationDto', 'DeliveryLocationRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<DeliveryLocation> = {
      data: result.data.map(dto => mapper.map<DeliveryLocationDto, DeliveryLocation>(dto, 'DeliveryLocationDto', 'DeliveryLocation')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
