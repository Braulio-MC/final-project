import { inject, singleton } from 'tsyringe'
import IService from './IService'
import mapper from '../../core/Mapper'
import StoreDto from '../dto/StoreDto'
import Store from '../model/Store'
import IStoreRepository from '../repository/store/IStoreRepository'
import Criteria from '../../core/criteria/Criteria'
import IStoreReviewRepository from '../repository/storeReview/IStoreReviewRepository'
import Order from '../../core/criteria/Order'
import OrderType from '../../core/criteria/OrderType'
import OrderTypes from '../../core/criteria/OrderTypes'
import Filters from '../../core/criteria/Filters'
import Filter from '../../core/criteria/Filter'
import FilterOperator from '../../core/criteria/FilterOperator'
import FilterOperators from '../../core/criteria/FilterOperators'
import StoreReviewDto from '../dto/StoreReviewDto'
import StoreReview from '../model/StoreReview'
import { PagingResult, StoreSearchResult } from '../../types'

@singleton()
export default class StoreService implements IService<StoreDto, Store> {
  constructor (
    @inject('StoreRepository') private readonly repository: IStoreRepository,
    @inject('StoreReviewRepository') private readonly storeReviewRepository: IStoreReviewRepository
  ) {}

  async create (item: StoreDto): Promise<void> {
    await this.repository.create(item)
  }

  async update (id: string, item: Partial<StoreDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async search (query: string, perPage: number): Promise<StoreSearchResult[]> {
    const result = await this.repository.search(query, perPage)
    return result
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Store>> {
    const result = await this.repository.paging(limit, after, before)
    const stores = result.data.map(dto => mapper.map<StoreDto, Store>(dto, 'StoreDto', 'Store'))
    const order = new Order('', new OrderType(OrderTypes.NONE))
    for (const store of stores) {
      const filters = new Filters([new Filter('storeId', new FilterOperator(FilterOperators.EQUAL), store.id)])
      const criteria = new Criteria(filters, order, 1)
      const resultReview = await this.storeReviewRepository.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        const review = resultReview.data[0]
        const storeReview = mapper.map<StoreReviewDto, StoreReview>(review, 'StoreReviewDto', 'StoreReview')
        store.rating = storeReview.rating
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
    return pagingResult
  }

  async findById (id: string): Promise<Store | null> {
    const result = await this.repository.findById(id)
    if (result != null) {
      const store = mapper.map<StoreDto, Store>(result, 'StoreDto', 'Store')
      const filters = new Filters([new Filter('productId', new FilterOperator(FilterOperators.EQUAL), store.id)])
      const order = new Order('', new OrderType(OrderTypes.NONE))
      const criteria = new Criteria(filters, order, 1)
      const resultReview = await this.storeReviewRepository.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        const review = resultReview.data[0]
        const storeReview = mapper.map<StoreReviewDto, StoreReview>(review, 'StoreReviewDto', 'StoreReview')
        store.rating = storeReview.rating
      } else {
        store.rating = 0
      }
      return store
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Store>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const stores = result.data.map(dto => mapper.map<StoreDto, Store>(dto, 'StoreDto', 'Store'))
    const order = new Order('', new OrderType(OrderTypes.NONE))
    for (const store of stores) {
      const filters = new Filters([new Filter('storeId', new FilterOperator(FilterOperators.EQUAL), store.id)])
      const criteria = new Criteria(filters, order, 1)
      const resultReview = await this.storeReviewRepository.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        const review = resultReview.data[0]
        const storeReview = mapper.map<StoreReviewDto, StoreReview>(review, 'StoreReviewDto', 'StoreReview')
        store.rating = storeReview.rating
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
    return pagingResult
  }
}
