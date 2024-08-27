import StoreDto from '../../../data/dto/StoreDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IStoreDtoBuilder extends IBaseBuilder<IStoreDtoBuilder, StoreDto> {
  setName: (name: string) => IStoreDtoBuilder
  setDescription: (description: string) => IStoreDtoBuilder
  setEmail: (email: string) => IStoreDtoBuilder
  setPhoneNumber: (phoneNumber: string) => IStoreDtoBuilder
  setImage: (image: string) => IStoreDtoBuilder
  setUserId: (id: string) => IStoreDtoBuilder
}
