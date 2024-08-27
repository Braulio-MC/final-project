import StoreFavoriteDto from '../../../data/dto/StoreFavoriteDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IStoreFavoriteDtoBuilder extends IBaseBuilder<IStoreFavoriteDtoBuilder, StoreFavoriteDto> {
  setUserId: (id: string) => IStoreFavoriteDtoBuilder
  setStoreId: (id: string) => IStoreFavoriteDtoBuilder
  setName: (name: string) => IStoreFavoriteDtoBuilder
  setImage: (image: string) => IStoreFavoriteDtoBuilder
  setDescription: (description: string) => IStoreFavoriteDtoBuilder
  setEmail: (email: string) => IStoreFavoriteDtoBuilder
  setPhoneNumber: (phoneNumber: string) => IStoreFavoriteDtoBuilder
}
