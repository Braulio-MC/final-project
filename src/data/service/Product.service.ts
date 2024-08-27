import { inject, singleton } from 'tsyringe'
import ProductDto from '../dto/ProductDto'
import Product from '../model/Product'
import IService from './IService'
import IProductRepository from '../repository/product/IProductRepository'
import mapper from '../../core/Mapper'
import Criteria from '../../core/criteria/Criteria'
import Filters from '../../core/criteria/Filters'
import Filter from '../../core/criteria/Filter'
import FilterOperator from '../../core/criteria/FilterOperator'
import FilterOperators from '../../core/criteria/FilterOperators'
import { PagingResult } from '../../types'
import RedisRepository from '../persistance/redis/RedisRepository'
import ProductRedis from '../persistance/redis/model/ProductRedis'
import ProductReviewService from './ProductReview.service'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class ProductService implements IService<ProductDto, Product> {
  constructor (
    @inject('ProductRepository') private readonly repository: IProductRepository,
    @inject(ProductReviewService) private readonly productReviewService: ProductReviewService,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async create (item: ProductDto): Promise<string> {
    return await this.repository.create(item)
  }

  async update (id: string, item: Partial<ProductDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Product>> {
    const cachedKey = `product_paging_${limit}_${after}_${before}`
    const cachedResult = await this.redisRepository.get<PagingResult<ProductRedis>>(cachedKey)
    if (cachedResult != null) {
      const products = cachedResult.data.map(dto => mapper.map<ProductRedis, Product>(dto, 'ProductRedis', 'Product'))
      for (const product of products) {
        const filters = new Filters([new Filter('productId', new FilterOperator(FilterOperators.EQUAL), product.id)])
        const criteria = new Criteria(filters, 1)
        const resultReview = await this.productReviewService.pagingByCriteria(criteria)
        if (resultReview.data.length > 0) {
          product.rating = resultReview.data[0].rating
        } else {
          product.rating = 0
        }
      }
      const pagingResult: PagingResult<Product> = {
        data: products,
        pagination: {
          prev: cachedResult.pagination.prev,
          next: cachedResult.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.paging(limit, after, before)
    const cacheValue: PagingResult<ProductRedis> = {
      data: result.data.map(dto => mapper.map<ProductDto, ProductRedis>(dto, 'ProductDto', 'ProductRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const products = result.data.map(dto => mapper.map<ProductDto, Product>(dto, 'ProductDto', 'Product'))
    for (const product of products) {
      const filters = new Filters([new Filter('productId', new FilterOperator(FilterOperators.EQUAL), product.id)])
      const criteria = new Criteria(filters, 1)
      const resultReview = await this.productReviewService.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        product.rating = resultReview.data[0].rating
      } else {
        product.rating = 0
      }
    }
    const pagingResult: PagingResult<Product> = {
      data: products,
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }

  async findById (id: string): Promise<Product | null> {
    const cachedKey = `product_findById_${id}`
    const cachedResult = await this.redisRepository.get<ProductRedis>(cachedKey)
    if (cachedResult != null) {
      const product = mapper.map<ProductRedis, Product>(cachedResult, 'ProductRedis', 'Product')
      const filters = new Filters([new Filter('productId', new FilterOperator(FilterOperators.EQUAL), product.id)])
      const criteria = new Criteria(filters, 1)
      const resultReview = await this.productReviewService.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        product.rating = resultReview.data[0].rating
      } else {
        product.rating = 0
      }
      console.log('returning from cache')
      return product
    }
    const result = await this.repository.findById(id)
    if (result != null) {
      const cacheValue = mapper.map<ProductDto, ProductRedis>(result, 'ProductDto', 'ProductRedis')
      await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
      const product = mapper.map<ProductDto, Product>(result, 'ProductDto', 'Product')
      const filters = new Filters([new Filter('productId', new FilterOperator(FilterOperators.EQUAL), product.id)])
      const criteria = new Criteria(filters, 1)
      const resultReview = await this.productReviewService.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        product.rating = resultReview.data[0].rating
      } else {
        product.rating = 0
      }
      console.log('returning from db')
      return product
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    return await this.repository.existsByCriteria(criteria)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Product>> {
    const cachedKey = `product_pagingByCriteria_${criteria.toRedisKey()}`
    const cachedValue = await this.redisRepository.get<PagingResult<ProductRedis>>(cachedKey)
    if (cachedValue != null) {
      const products = cachedValue.data.map(dto => mapper.map<ProductRedis, Product>(dto, 'ProductRedis', 'Product'))
      for (const product of products) {
        const filters = new Filters([new Filter('productId', new FilterOperator(FilterOperators.EQUAL), product.id)])
        const criteria = new Criteria(filters, 1)
        const resultReview = await this.productReviewService.pagingByCriteria(criteria)
        if (resultReview.data.length > 0) {
          product.rating = resultReview.data[0].rating
        } else {
          product.rating = 0
        }
      }
      const pagingResult: PagingResult<Product> = {
        data: products,
        pagination: {
          prev: cachedValue.pagination.prev,
          next: cachedValue.pagination.next
        }
      }
      console.log('returning from cache')
      return pagingResult
    }
    const result = await this.repository.pagingByCriteria(criteria)
    const cacheValue: PagingResult<ProductRedis> = {
      data: result.data.map(dto => mapper.map<ProductDto, ProductRedis>(dto, 'ProductDto', 'ProductRedis')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    const products = result.data.map(dto => mapper.map<ProductDto, Product>(dto, 'ProductDto', 'Product'))
    for (const product of products) {
      const filters = new Filters([new Filter('productId', new FilterOperator(FilterOperators.EQUAL), product.id)])
      const criteria = new Criteria(filters, 1)
      const resultReview = await this.productReviewService.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        product.rating = resultReview.data[0].rating
      } else {
        product.rating = 0
      }
    }
    const pagingResult: PagingResult<Product> = {
      data: products,
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    console.log('returning from db')
    return pagingResult
  }
}
