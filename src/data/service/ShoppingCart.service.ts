import { inject, singleton } from 'tsyringe'
import mapper from '../../core/Mapper'
import ShoppingCartDto from '../dto/ShoppingCartDto'
import ShoppingCart from '../model/ShoppingCart'
import IShoppingCartRepository from '../repository/shoppingcart/IShoppingCartRepository'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult, ShoppingCartResult, ShoppingCartResultRedis } from '../../types'
import IService from './IService'
import RedisRepository from '../persistance/redis/RedisRepository'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class ShoppingCartService implements IService<ShoppingCartDto, ShoppingCart> {
  constructor (
    @inject('ShoppingCartRepository') private readonly repository: IShoppingCartRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: ShoppingCartDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<ShoppingCartDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<ShoppingCart>> {
    const cachedKey = `shoppingcart_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<ShoppingCartResultRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<ShoppingCart> = {
        data: cachedResult.data.map(dto => mapper.map<ShoppingCartResultRedis, ShoppingCart>(dto, 'ShoppingCartResultRedis', 'ShoppingCart')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<ShoppingCartResultRedis> = {
      data: result.data.map(dto => mapper.map<ShoppingCartResult, ShoppingCartResultRedis>(dto, 'ShoppingCartResult', 'ShoppingCartResultRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<ShoppingCart> = {
      data: result.data.map(dto => mapper.map<ShoppingCartResult, ShoppingCart>(dto, 'ShoppingCartResult', 'ShoppingCart')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string): Promise<ShoppingCart | null> {
    const cachedKey = `shoppingcart_findById_${id}`
    const cachedResult = await this.redisRepository.get<ShoppingCartResultRedis>(cachedKey)
    if (cachedResult != null) {
      console.log('returning from cache')
      return mapper.map<ShoppingCartResultRedis, ShoppingCart>(cachedResult, 'ShoppingCartResultRedis', 'ShoppingCart')
    }
    const result = await this.repository.findById(id)
    if (result !== null) {
      const cacheValue = mapper.map<ShoppingCartResult, ShoppingCartResultRedis>(result, 'ShoppingCartResult', 'ShoppingCartResultRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      console.log('returning from db')
      return mapper.map<ShoppingCartResult, ShoppingCart>(result, 'ShoppingCartResult', 'ShoppingCart')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<ShoppingCart>> {
    const cachedKey = `shoppingcart_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<ShoppingCartResultRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<ShoppingCart> = {
        data: cachedResult.data.map(dto => mapper.map<ShoppingCartResultRedis, ShoppingCart>(dto, 'ShoppingCartResultRedis', 'ShoppingCart')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<ShoppingCartResultRedis> = {
      data: result.data.map(dto => mapper.map<ShoppingCartResult, ShoppingCartResultRedis>(dto, 'ShoppingCartResult', 'ShoppingCartResultRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<ShoppingCart> = {
      data: result.data.map(dto => mapper.map<ShoppingCartResult, ShoppingCart>(dto, 'ShoppingCartResult', 'ShoppingCart')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
