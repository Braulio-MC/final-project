import ShoppingCartProductDto from '../../../data/dto/ShoppingCartProductDto'
import IShoppingCartProductDtoBuilder from './IShoppingCartProductDtoBuilder'

export default class ShoppingCartProductDtoBuilder implements IShoppingCartProductDtoBuilder {
  private productDto!: ShoppingCartProductDto[]

  constructor () {
    this.reset()
  }

  private reset (): void {
    this.productDto = []
  }

  setProducts (products: ShoppingCartProductDto[]): IShoppingCartProductDtoBuilder {
    this.productDto = products
    return this
  }

  build (): ShoppingCartProductDto[] {
    const result = this.productDto
    this.reset()
    return result
  }
}
