import ShoppingCartDto from '../../../data/dto/ShoppingCartDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IShoppingCartDtoBuilder extends IBaseBuilder<IShoppingCartDtoBuilder, ShoppingCartDto> {
  setUserId: (id: string) => IShoppingCartDtoBuilder
  setStoreId: (id: string) => IShoppingCartDtoBuilder
  setStoreName: (name: string) => IShoppingCartDtoBuilder
}
