import Criteria from '../../core/criteria/Criteria'
import { PagingResult, ShoppingCartResult } from '../../types'
import ShoppingCartDto from '../dto/ShoppingCartDto'
import ShoppingCartProductDto from '../dto/ShoppingCartProductDto'

export default interface IShoppingCartService {
  create: (item: ShoppingCartDto, products: ShoppingCartProductDto[]) => Promise<void>
  update: (id: string, shoppingCart: Partial<ShoppingCartDto>, products: ShoppingCartProductDto[]) => Promise<void>
  paging: (limit: number, after: string, before: string) => Promise<PagingResult<ShoppingCartResult>>
  findById: (id: string) => Promise<ShoppingCartResult | null>
  delete: (id: string) => Promise<void>
  pagingByCriteria: (criteria: Criteria) => Promise<PagingResult<ShoppingCartResult>>
}
