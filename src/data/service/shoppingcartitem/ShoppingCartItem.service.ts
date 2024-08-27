import { inject, singleton } from 'tsyringe'
import ShoppingCartProductDto from '../../dto/ShoppingCartProductDto'
import ShoppingCartProduct from '../../model/ShoppingCartProduct'
import RedisRepository from '../../persistance/redis/RedisRepository'
import FirestoreShoppingCartItemRepository from '../../repository/shoppingcartitem/FirestoreShoppingCartItemRepository'
import { PagingResult } from '../../../types'
import ShoppingCartProductRedis from '../../persistance/redis/model/ShoppingCartProductRedis'
import mapper from '../../../core/Mapper'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../../core/Constants'
import Criteria from '../../../core/criteria/Criteria'
import IShoppingCartItemService from './IShoppingCartItemService'

@singleton()
export default class ShoppingCartItemService implements IShoppingCartItemService {
  constructor (
    @inject('ShoppingCartItemRepository') private readonly repository: FirestoreShoppingCartItemRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: ShoppingCartProductDto, chatId?: string): Promise<string> {
    return await this.repository.create(item, chatId)
  }

  async createAsBatch (cartId: string, items: ShoppingCartProductDto[]): Promise<void> {
    await this.repository.createAsBatch(cartId, items)
  }

  async update (id: string, item: Partial<ShoppingCartProductDto>, nestedId?: string): Promise<void> {
    await this.repository.update(id, item, nestedId)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<ShoppingCartProduct>> {
    const cachedKey = `shoppingcartitem_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<ShoppingCartProductRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<ShoppingCartProduct> = {
        data: cachedResult.data.map(dto => mapper.map<ShoppingCartProductRedis, ShoppingCartProduct>(dto, 'ShoppingCartProductRedis', 'ShoppingCartProduct')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<ShoppingCartProductRedis> = {
      data: result.data.map(dto => mapper.map<ShoppingCartProductDto, ShoppingCartProductRedis>(dto, 'ShoppingCartProductDto', 'ShoppingCartProductRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<ShoppingCartProduct> = {
      data: result.data.map(dto => mapper.map<ShoppingCartProductDto, ShoppingCartProduct>(dto, 'ShoppingCartProductDto', 'ShoppingCartProduct')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string, nestedId?: string): Promise<ShoppingCartProduct | null> {
    const cachedKey = `shoppingcartitem_findById_${id}`
    const cachedResult = await this.redisRepository.get<ShoppingCartProductRedis>(cachedKey)
    if (cachedResult != null) {
      console.log('returning from cache')
      return mapper.map<ShoppingCartProductRedis, ShoppingCartProduct>(cachedResult, 'ShoppingCartProductRedis', 'ShoppingCartProduct')
    }
    const result = await this.repository.findById(id, nestedId)
    if (result !== null) {
      const cacheValue = mapper.map<ShoppingCartProductDto, ShoppingCartProductRedis>(result, 'ShoppingCartProductDto', 'ShoppingCartProductRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      console.log('returning from db')
      return mapper.map<ShoppingCartProductDto, ShoppingCartProduct>(result, 'ShoppingCartProductDto', 'ShoppingCartProduct')
    }
    return null
  }

  async delete (id: string, nestedId?: string): Promise<void> {
    await this.repository.delete(id, nestedId)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<ShoppingCartProduct>> {
    const cachedKey = `shoppingcartitem_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<ShoppingCartProductRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<ShoppingCartProduct> = {
        data: cachedResult.data.map(dto => mapper.map<ShoppingCartProductRedis, ShoppingCartProduct>(dto, 'ShoppingCartProductRedis', 'ShoppingCartProduct')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<ShoppingCartProductRedis> = {
      data: result.data.map(dto => mapper.map<ShoppingCartProductDto, ShoppingCartProductRedis>(dto, 'ShoppingCartProductDto', 'ShoppingCartProductRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<ShoppingCartProduct> = {
      data: result.data.map(dto => mapper.map<ShoppingCartProductDto, ShoppingCartProduct>(dto, 'ShoppingCartProductDto', 'ShoppingCartProduct')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
