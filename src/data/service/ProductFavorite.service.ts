import { inject, singleton } from 'tsyringe'
import IService from './IService'
import mapper from '../../core/Mapper'
import ProductFavoriteDto from '../dto/ProductFavoriteDto'
import ProductFavorite from '../model/ProductFavorite'
import IProductFavoriteRepository from '../repository/productfavorite/IProductFavoriteRepository'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'
import RedisRepository from '../persistance/redis/RedisRepository'
import ProductFavoriteRedis from '../persistance/redis/model/ProductFavoriteRedis'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class ProductFavoriteService implements IService<ProductFavoriteDto, ProductFavorite> {
  constructor (
    @inject('ProductFavoriteRepository') private readonly repository: IProductFavoriteRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: ProductFavoriteDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<ProductFavoriteDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<ProductFavorite>> {
    const cachedKey = `productfavorite_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<ProductFavoriteRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<ProductFavorite> = {
        data: cachedResult.data.map(dto => mapper.map<ProductFavoriteRedis, ProductFavorite>(dto, 'ProductFavoriteRedis', 'ProductFavorite')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<ProductFavoriteRedis> = {
      data: result.data.map(dto => mapper.map<ProductFavoriteDto, ProductFavoriteRedis>(dto, 'ProductFavoriteDto', 'ProductFavoriteRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<ProductFavorite> = {
      data: result.data.map(dto => mapper.map<ProductFavoriteDto, ProductFavorite>(dto, 'ProductFavoriteDto', 'ProductFavorite')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string): Promise<ProductFavorite | null> {
    const cachedKey = `productfavorite_findById_${id}`
    const cachedResult = await this.redisRepository.get<ProductFavoriteRedis>(cachedKey)
    if (cachedResult != null) {
      console.log('returning from cache')
      return mapper.map<ProductFavoriteRedis, ProductFavorite>(cachedResult, 'ProductFavoriteRedis', 'ProductFavorite')
    }
    const result = await this.repository.findById(id)
    if (result !== null) {
      const cacheValue = mapper.map<ProductFavoriteDto, ProductFavoriteRedis>(result, 'ProductFavoriteDto', 'ProductFavoriteRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      console.log('returning from db')
      return mapper.map<ProductFavoriteDto, ProductFavorite>(result, 'ProductFavoriteDto', 'ProductFavorite')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<ProductFavorite>> {
    const cachedKey = `productfavorite_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<ProductFavoriteRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<ProductFavorite> = {
        data: cachedResult.data.map(dto => mapper.map<ProductFavoriteRedis, ProductFavorite>(dto, 'ProductFavoriteRedis', 'ProductFavorite')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<ProductFavoriteRedis> = {
      data: result.data.map(dto => mapper.map<ProductFavoriteDto, ProductFavoriteRedis>(dto, 'ProductFavoriteDto', 'ProductFavoriteRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<ProductFavorite> = {
      data: result.data.map(dto => mapper.map<ProductFavoriteDto, ProductFavorite>(dto, 'ProductFavoriteDto', 'ProductFavorite')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
