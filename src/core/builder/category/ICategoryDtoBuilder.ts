import CategoryDto from '../../../data/dto/CategoryDto'
import { IBaseBuilder } from '../IBaseBuilder'

export default interface ICategoryDtoBuilder extends IBaseBuilder<ICategoryDtoBuilder, CategoryDto> {
  setName: (name: string) => ICategoryDtoBuilder
  setParentID: (id: string) => ICategoryDtoBuilder
  setParentName: (name: string) => ICategoryDtoBuilder
  setStoreID: (id: string) => ICategoryDtoBuilder
}
