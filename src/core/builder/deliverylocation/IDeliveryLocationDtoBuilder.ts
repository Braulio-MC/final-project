import DeliveryLocationDto from '../../../data/dto/DeliveryLocationDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface IDeliveryLocationDtoBuilder extends IBaseBuilder<IDeliveryLocationDtoBuilder, DeliveryLocationDto> {
  setName: (name: string) => IDeliveryLocationDtoBuilder
  setDescription: (description: string) => IDeliveryLocationDtoBuilder
  setStoreID: (id: string) => IDeliveryLocationDtoBuilder
}
