import { inject, singleton } from 'tsyringe'
import PaymentDto from '../dto/PaymentDto'
import Payment from '../model/Payment'
import IService from './IService'
import IPaymentRepository from '../repository/payment/IPaymentRepository'
import mapper from '../../core/Mapper'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'
import RedisRepository from '../persistance/redis/RedisRepository'
import PaymentRedis from '../persistance/redis/model/PaymentRedis'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class PaymentService implements IService<PaymentDto, Payment> {
  constructor (
    @inject('PaymentRepository') private readonly repository: IPaymentRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: PaymentDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<PaymentDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Payment>> {
    const cachedKey = `payment_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<PaymentRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<Payment> = {
        data: cachedResult.data.map(dto => mapper.map<PaymentRedis, Payment>(dto, 'PaymentRedis', 'Payment')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<PaymentRedis> = {
      data: result.data.map(dto => mapper.map<PaymentDto, PaymentRedis>(dto, 'PaymentDto', 'PaymentRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<Payment> = {
      data: result.data.map(dto => mapper.map<PaymentDto, Payment>(dto, 'PaymentDto', 'Payment')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string): Promise<Payment | null> {
    const cachedKey = `payment_findById_${id}`
    const cachedResult = await this.redisRepository.get<PaymentRedis>(cachedKey)
    if (cachedResult != null) {
      console.log('returning from cache')
      return mapper.map<PaymentRedis, Payment>(cachedResult, 'PaymentRedis', 'Payment')
    }
    const result = await this.repository.findById(id)
    if (result != null) {
      const cacheValue = mapper.map<PaymentDto, PaymentRedis>(result, 'PaymentDto', 'PaymentRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      console.log('returning from db')
      return mapper.map<PaymentDto, Payment>(result, 'PaymentDto', 'Payment')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Payment>> {
    const cachedKey = `payment_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedResult = await this.redisRepository.get<PagingResult<PaymentRedis>>(cachedKey)
    if (cachedResult != null) {
      const pagingResult: PagingResult<Payment> = {
        data: cachedResult.data.map(dto => mapper.map<PaymentRedis, Payment>(dto, 'PaymentRedis', 'Payment')),
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<PaymentRedis> = {
      data: result.data.map(dto => mapper.map<PaymentDto, PaymentRedis>(dto, 'PaymentDto', 'PaymentRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const pagingResult: PagingResult<Payment> = {
      data: result.data.map(dto => mapper.map<PaymentDto, Payment>(dto, 'PaymentDto', 'Payment')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
