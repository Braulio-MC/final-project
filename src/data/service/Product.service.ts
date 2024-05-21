import { inject, singleton } from 'tsyringe'
import ProductDto from '../dto/ProductDto'
import Product from '../model/Product'
import IService from './IService'
import IProductRepository from '../repository/product/IProductRepository'
import mapper from '../../core/Mapper'
import IProductReviewRepository from '../repository/productReview/IProductReviewRepository'
import ProductReviewDto from '../dto/ProductReviewDto'
import ProductReview from '../model/ProductReview'
import Criteria from '../../core/criteria/Criteria'
import Filters from '../../core/criteria/Filters'
import Filter from '../../core/criteria/Filter'
import FilterOperator from '../../core/criteria/FilterOperator'
import FilterOperators from '../../core/criteria/FilterOperators'
import Order from '../../core/criteria/Order'
import OrderType from '../../core/criteria/OrderType'
import OrderTypes from '../../core/criteria/OrderTypes'
import { PagingResult, ProductSearchResult } from '../../types'

@singleton()
export default class ProductService implements IService<ProductDto, Product> {
  constructor (
    @inject('ProductRepository') private readonly repository: IProductRepository,
    @inject('ProductReviewRepository') private readonly productReviewRepository: IProductReviewRepository
  ) {}

  async create (item: ProductDto): Promise<void> {
    await this.repository.create(item)
  }

  async update (id: string, item: Partial<ProductDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async search (query: string, perPage: number): Promise<ProductSearchResult[]> {
    const result = await this.repository.search(query, perPage)
    return result
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<Product>> {
    const result = await this.repository.paging(limit, after, before)
    const products = result.data.map(dto => mapper.map<ProductDto, Product>(dto, 'ProductDto', 'Product'))
    const order = new Order('', new OrderType(OrderTypes.NONE))
    for (const product of products) {
      const filters = new Filters([new Filter('productId', new FilterOperator(FilterOperators.EQUAL), product.id)])
      const criteria = new Criteria(filters, order, 1)
      const resultReview = await this.productReviewRepository.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        const review = resultReview.data[0]
        const productReview = mapper.map<ProductReviewDto, ProductReview>(review, 'ProductReviewDto', 'ProductReview')
        product.rating = productReview.rating
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
    return pagingResult
  }

  async findById (id: string): Promise<Product | null> {
    const result = await this.repository.findById(id)
    if (result != null) {
      const product = mapper.map<ProductDto, Product>(result, 'ProductDto', 'Product')
      const filters = new Filters([new Filter('productId', new FilterOperator(FilterOperators.EQUAL), product.id)])
      const order = new Order('', new OrderType(OrderTypes.NONE))
      const criteria = new Criteria(filters, order, 1)
      const resultReview = await this.productReviewRepository.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        const review = resultReview.data[0]
        const productReview = mapper.map<ProductReviewDto, ProductReview>(review, 'ProductReviewDto', 'ProductReview')
        product.rating = productReview.rating
      } else {
        product.rating = 0
      }
      return product
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<Product>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const products = result.data.map(dto => mapper.map<ProductDto, Product>(dto, 'ProductDto', 'Product'))
    const order = new Order('', new OrderType(OrderTypes.NONE))
    for (const product of products) {
      const filters = new Filters([new Filter('productId', new FilterOperator(FilterOperators.EQUAL), product.id)])
      const criteria = new Criteria(filters, order, 1)
      const resultReview = await this.productReviewRepository.pagingByCriteria(criteria)
      if (resultReview.data.length > 0) {
        const review = resultReview.data[0]
        const productReview = mapper.map<ProductReviewDto, ProductReview>(review, 'ProductReviewDto', 'ProductReview')
        product.rating = productReview.rating
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
    return pagingResult
  }
}
