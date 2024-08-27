import { inject, singleton } from 'tsyringe'
import IService from './IService'
import mapper from '../../core/Mapper'
import StoreDto from '../dto/StoreDto'
import Store from '../model/Store'
import IStoreRepository from '../repository/store/IStoreRepository'
import Criteria from '../../core/criteria/Criteria'
import Filters from '../../core/criteria/Filters'
import Filter from '../../core/criteria/Filter'
import FilterOperator from '../../core/criteria/FilterOperator'
import FilterOperators from '../../core/criteria/FilterOperators'
import { PagingResult } from '../../types'
import StoreReviewService from './StoreReview.service'
import RedisRepository from '../persistance/redis/RedisRepository'
import StoreRedis from '../persistance/redis/model/StoreRedis'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class StoreService implements IService<StoreDto, Store> {
  constructor (
    @inject('StoreRepository') private readonly repository: IStoreRepository,
    @inject(StoreReviewService) private readonly storeReviewService: StoreReviewService,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: StoreDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<StoreDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Store>> {
    const cachedKey = `store_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<StoreRedis>>(cachedKey)
    if (cachedResult != null) {
      const stores = cachedResult.data.map(dto => mapper.map<StoreRedis, Store>(dto, 'StoreRedis', 'Store'))
      for (const store of stores) {
        const filters = new Filters([new Filter('storeId', new FilterOperator(FilterOperators.EQUAL), store.id)])
        const criteria = new Criteria(filters, 1)
        const resultReview = await this.storeReviewService.pagingByCriteria(criteria)
        if (resultReview.data.length > 0) {
          store.rating = resultReview.data[0].rating
        } else {
          store.rating = 0
        }
      }
      const pagingResult: PagingResult<Store> = {
        data: stores,
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<StoreRedis> = {
      data: result.data.map(dto => mapper.map<StoreDto, StoreRedis>(dto, 'StoreDto', 'StoreRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const stores = result.data.map(dto => mapper.map<StoreDto, Store>(dto, 'StoreDto', 'Store'))
    for (const store of stores) {
      const filters = new Filters([new Filter('storeId', new FilterOperator(FilterOperators.EQUAL), store.id)])
      const criteria = new Criteria(filters, 1)
      const resultReview = await this.storeReviewService.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        store.rating = resultReview.data[0].rating
      } else {
        store.rating = 0
      }
    }
    const pagingResult: PagingResult<Store> = {
      data: stores,
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string): Promise<Store | null> {
    const cachedKey = `store_findById_${id}`
    const cachedResult = await this.redisRepository.get<StoreRedis>(cachedKey)
    if (cachedResult != null) {
      const store = mapper.map<StoreRedis, Store>(cachedResult, 'StoreRedis', 'Store')
      const filters = new Filters([new Filter('storeId', new FilterOperator(FilterOperators.EQUAL), store.id)])
      const criteria = new Criteria(filters, 1)
      const resultReview = await this.storeReviewService.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        store.rating = resultReview.data[0].rating
      } else {
        store.rating = 0
      }
      console.log('returning from cache')
      return store
    }
    const result = await this.repository.findById(id)
    if (result != null) {
      const cacheValue = mapper.map<StoreDto, StoreRedis>(result, 'StoreDto', 'StoreRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      const store = mapper.map<StoreDto, Store>(result, 'StoreDto', 'Store')
      const filters = new Filters([new Filter('storeId', new FilterOperator(FilterOperators.EQUAL), store.id)])
      const criteria = new Criteria(filters, 1)
      const resultReview = await this.storeReviewService.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        store.rating = resultReview.data[0].rating
      } else {
        store.rating = 0
      }
      console.log('returning from db')
      return store
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    console.log('Checking existence of store by criteria')
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Store>> {
    const cachedKey = `store_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<StoreRedis>>(cachedKey)
    if (cachedResult != null) {
      const stores = cachedResult.data.map(dto => mapper.map<StoreRedis, Store>(dto, 'StoreRedis', 'Store'))
      for (const store of stores) {
        const filters = new Filters([new Filter('storeId', new FilterOperator(FilterOperators.EQUAL), store.id)])
        const criteria = new Criteria(filters, 1)
        const resultReview = await this.storeReviewService.pagingByCriteria(criteria)
        if (resultReview.data.length > 0) {
          store.rating = resultReview.data[0].rating
        } else {
          store.rating = 0
        }
      }
      const pagingResult: PagingResult<Store> = {
        data: stores,
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<StoreRedis> = {
      data: result.data.map(dto => mapper.map<StoreDto, StoreRedis>(dto, 'StoreDto', 'StoreRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const stores = result.data.map(dto => mapper.map<StoreDto, Store>(dto, 'StoreDto', 'Store'))
    for (const store of stores) {
      const filters = new Filters([new Filter('storeId', new FilterOperator(FilterOperators.EQUAL), store.id)])
      const criteria = new Criteria(filters, 1)
      const resultReview = await this.storeReviewService.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        store.rating = resultReview.data[0].rating
      } else {
        store.rating = 0
      }
    }
    const pagingResult: PagingResult<Store> = {
      data: stores,
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
