import { inject, singleton } from 'tsyringe'
import OrderLineDto from '../../dto/OrderLineDto'
import OrderLine from '../../model/OrderLine'
import RedisRepository from '../../persistance/redis/RedisRepository'
import IOrderlineRepository from '../../repository/orderline/IOrderlineRepository'
import { PagingResult } from '../../../types'
import OrderLineRedis from '../../persistance/redis/model/OrderLineRedis'
import mapper from '../../../core/Mapper'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../../core/Constants'
import Criteria from '../../../core/criteria/Criteria'
import IOrderlineService from './IOrderlineService'

@singleton()
export default class OrderlineService implements IOrderlineService {
  constructor (
    @inject('OrderlineRepository') private readonly repository: IOrderlineRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: OrderLineDto, chatId?: string): Promise<string> {
    return await this.repository.create(item, chatId)
  }

  async createAsBatch (orderId: string, messages: OrderLineDto[]): Promise<void> {
    await this.repository.createAsBatch(orderId, messages)
  }

  async update (id: string, item: Partial<OrderLineDto>, nestedId?: string): Promise<void> {
    await this.repository.update(id, item, nestedId)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<OrderLine>> {
    const cachedKey = `orderline_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<OrderLineRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<OrderLine> = {
        data: cachedResult.data.map(dto => mapper.map<OrderLineRedis, OrderLine>(dto, 'OrderLineRedis', 'OrderLine')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<OrderLineRedis> = {
      data: result.data.map(dto => mapper.map<OrderLineDto, OrderLineRedis>(dto, 'OrderLineDto', 'OrderLineRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<OrderLine> = {
      data: result.data.map(dto => mapper.map<OrderLineDto, OrderLine>(dto, 'OrderLineDto', 'OrderLine')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string, nestedId?: string): Promise<OrderLine | null> {
    const cachedKey = `orderline_findById_${id}_${nestedId as string}`
    const cachedResult = await this.redisRepository.get<OrderLineRedis>(cachedKey)
    if (cachedResult != null) {
      console.log('returning from cache')
      return mapper.map<OrderLineRedis, OrderLine>(cachedResult, 'OrderLineRedis', 'OrderLine')
    }
    const result = await this.repository.findById(id, nestedId)
    if (result !== null) {
      const cacheValue = mapper.map<OrderLineDto, OrderLineRedis>(result, 'OrderLineDto', 'OrderLineRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      console.log('returning from db')
      return mapper.map<OrderLineDto, OrderLine>(result, 'OrderLineDto', 'OrderLine')
    }
    return null
  }

  async delete (id: string, nestedId?: string): Promise<void> {
    await this.repository.delete(id, nestedId)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<OrderLine>> {
    const cachedKey = `orderline_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<OrderLineRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<OrderLine> = {
        data: cachedResult.data.map(dto => mapper.map<OrderLineRedis, OrderLine>(dto, 'OrderLineRedis', 'OrderLine')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<OrderLineRedis> = {
      data: result.data.map(dto => mapper.map<OrderLineDto, OrderLineRedis>(dto, 'OrderLineDto', 'OrderLineRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<OrderLine> = {
      data: result.data.map(dto => mapper.map<OrderLineDto, OrderLine>(dto, 'OrderLineDto', 'OrderLine')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
