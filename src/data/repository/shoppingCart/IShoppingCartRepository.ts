import { ShoppingCartResult } from '../../../types'
import ShoppingCartDto from '../../dto/ShoppingCartDto'
import IRepository from '../IRepository'

export default interface IShoppingCartRepository extends IRepository<ShoppingCartDto, ShoppingCartResult> {
}
