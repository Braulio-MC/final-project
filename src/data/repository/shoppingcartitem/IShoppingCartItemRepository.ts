import ShoppingCartProductDto from '../../dto/ShoppingCartProductDto'
import IRepository from '../IRepository'

export default interface IShoppingCartItemRepository extends IRepository<ShoppingCartProductDto> {
  createAsBatch: (cartId: string, messages: ShoppingCartProductDto[]) => Promise<void>
}
