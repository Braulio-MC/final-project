import ProductFavoriteDto from '../../../data/dto/ProductFavoriteDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IProductFavoriteDtoBuilder extends IBaseBuilder<IProductFavoriteDtoBuilder, ProductFavoriteDto> {
  setUserId: (id: string) => IProductFavoriteDtoBuilder
  setProductId: (id: string) => IProductFavoriteDtoBuilder
  setProductName: (name: string) => IProductFavoriteDtoBuilder
  setProductImage: (image: string) => IProductFavoriteDtoBuilder
  setProductDescription: (description: string) => IProductFavoriteDtoBuilder
}
