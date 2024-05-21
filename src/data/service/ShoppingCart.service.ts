import { inject, singleton } from 'tsyringe'
import mapper from '../../core/Mapper'
import ShoppingCartDto from '../dto/ShoppingCartDto'
import ShoppingCart from '../model/ShoppingCart'
import IShoppingCartRepository from '../repository/shoppingCart/IShoppingCartRepository'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult, ShoppingCartResult } from '../../types'
import IShoppingCartService from './IShoppingCartService'
import ShoppingCartProductDto from '../dto/ShoppingCartProductDto'

@singleton()
export default class ShoppingCartService implements IShoppingCartService {
  constructor (
    @inject('ShoppingCartRepository') private readonly repository: IShoppingCartRepository
  ) {}

  async create (item: ShoppingCartDto, products: ShoppingCartProductDto[]): Promise<void> {
    await this.repository.create(item, products)
  }

  async update (id: string, shoppingCart: Partial<ShoppingCartDto>, products: ShoppingCartProductDto[]): Promise<void> {
    await this.repository.update(id, shoppingCart, products)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<ShoppingCart>> {
    const result = await this.repository.paging(limit, after, before)
    const pagignResult: PagingResult<ShoppingCart> = {
      data: result.data.map(dto => mapper.map<ShoppingCartResult, ShoppingCart>(dto, 'ShoppingCartResult', 'ShoppingCart')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }

  async findById (id: string): Promise<ShoppingCart | null> {
    const result = await this.repository.findById(id)
    if (result !== null) {
      return mapper.map<ShoppingCartResult, ShoppingCart>(result, 'ShoppingCartResult', 'ShoppingCart')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<ShoppingCart>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const pagignResult: PagingResult<ShoppingCart> = {
      data: result.data.map(dto => mapper.map<ShoppingCartResult, ShoppingCart>(dto, 'ShoppingCartResult', 'ShoppingCart')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }
}
