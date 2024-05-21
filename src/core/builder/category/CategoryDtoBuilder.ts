import { Timestamp } from 'firebase-admin/firestore'
import ICategoryDtoBuilder from './ICategoryDtoBuilder'
import CategoryDto from '../../../data/dto/CategoryDto'
import { UUID } from 'crypto'

export default class CategoryDtoBuilder implements ICategoryDtoBuilder {
  private categoryDto!: CategoryDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetCategory: CategoryDto = {
      id: undefined,
      name: undefined,
      parent: {
        id: undefined,
        name: undefined
      },
      storeId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      paginationKey: undefined
    }
    this.categoryDto = resetCategory
  }

  setName (name: string): ICategoryDtoBuilder {
    this.categoryDto.name = name
    return this
  }

  setParentID (id: string): ICategoryDtoBuilder {
    if (this.categoryDto.parent !== undefined) {
      this.categoryDto.parent.id = id
    }
    return this
  }

  setParentName (name: string): ICategoryDtoBuilder {
    if (this.categoryDto.parent !== undefined) {
      this.categoryDto.parent.name = name
    }
    return this
  }

  setStoreID (id: string): ICategoryDtoBuilder {
    this.categoryDto.storeId = id
    return this
  }

  setCreatedAt (at: Timestamp): ICategoryDtoBuilder {
    this.categoryDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): ICategoryDtoBuilder {
    this.categoryDto.updatedAt = at
    return this
  }

  setPaginationKey (key: UUID): ICategoryDtoBuilder {
    this.categoryDto.paginationKey = key
    return this
  }

  build (): CategoryDto {
    const result = this.categoryDto
    this.reset()
    return result
  }
}
