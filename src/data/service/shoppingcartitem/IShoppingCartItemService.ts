import ShoppingCartProductDto from '../../dto/ShoppingCartProductDto'
import ShoppingCartProduct from '../../model/ShoppingCartProduct'
import IService from '../IService'

export default interface IShoppingCartItemService extends IService<ShoppingCartProductDto, ShoppingCartProduct> {
  createAsBatch: (cartId: string, items: ShoppingCartProductDto[]) => Promise<void>
}
