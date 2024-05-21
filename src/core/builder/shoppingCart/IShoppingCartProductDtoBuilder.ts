import ShoppingCartProductDto from '../../../data/dto/ShoppingCartProductDto'

export default interface IShoppingCartProductDtoBuilder {
  setProducts: (lines: ShoppingCartProductDto[]) => IShoppingCartProductDtoBuilder
  build: () => ShoppingCartProductDto[]
}
