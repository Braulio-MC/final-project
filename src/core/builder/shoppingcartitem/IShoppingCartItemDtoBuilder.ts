import ShoppingCartProductDto from '../../../data/dto/ShoppingCartProductDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IShoppingCartProductDtoBuilder extends IBaseBuilder<IShoppingCartProductDtoBuilder, ShoppingCartProductDto> {
  setProductId: (id: string) => IShoppingCartProductDtoBuilder
  setProductName: (name: string) => IShoppingCartProductDtoBuilder
  setProductImage: (image: string) => IShoppingCartProductDtoBuilder
  setProductPrice: (price: number) => IShoppingCartProductDtoBuilder
  setQuantity: (quantity: number) => IShoppingCartProductDtoBuilder
}
