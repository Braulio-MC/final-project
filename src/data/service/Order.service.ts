import { inject, singleton } from 'tsyringe'
import OrderDto from '../dto/OrderDto'
import mapper from '../../core/Mapper'
import Order from '../model/Order'
import IOrderRepository from '../repository/order/IOrderRepository'
import Criteria from '../../core/criteria/Criteria'
import { OrderResult, OrderResultRedis, PagingResult } from '../../types'
import IService from './IService'
import RedisRepository from '../persistance/redis/RedisRepository'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class OrderService implements IService<OrderDto, Order> {
  constructor (
    @inject('OrderRepository') private readonly repository: IOrderRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: OrderDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<OrderDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Order>> {
    const cachedKey = `order_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<OrderResultRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<Order> = {
        data: cachedResult.data.map(dto => mapper.map<OrderResultRedis, Order>(dto, 'OrderResultRedis', 'Order')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<OrderResultRedis> = {
      data: result.data.map(dto => mapper.map<OrderResult, OrderResultRedis>(dto, 'OrderResult', 'OrderResultRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<Order> = {
      data: result.data.map(dto => mapper.map<OrderResult, Order>(dto, 'OrderResult', 'Order')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string): Promise<Order | null> {
    const cachedKey = `order_findById_${id}`
    const cachedResult = await this.redisRepository.get<OrderResultRedis>(cachedKey)
    if (cachedResult != null) {
      console.log('returning from cache')
      return mapper.map<OrderResultRedis, Order>(cachedResult, 'OrderResultRedis', 'Order')
    }
    const result = await this.repository.findById(id)
    if (result !== null) {
      const cacheValue = mapper.map<OrderResult, OrderResultRedis>(result, 'OrderResult', 'OrderResultRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      console.log('returning from db')
      return mapper.map<OrderResult, Order>(result, 'OrderResult', 'Order')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Order>> {
    const cachedKey = `order_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<OrderResultRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<Order> = {
        data: cachedResult.data.map(dto => mapper.map<OrderResultRedis, Order>(dto, 'OrderResultRedis', 'Order')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<OrderResultRedis> = {
      data: result.data.map(dto => mapper.map<OrderResult, OrderResultRedis>(dto, 'OrderResult', 'OrderResultRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<Order> = {
      data: result.data.map(dto => mapper.map<OrderResult, Order>(dto, 'OrderResult', 'Order')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
