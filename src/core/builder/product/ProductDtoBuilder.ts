import { UUID } from 'crypto'
import ProductDto from '../../../data/dto/ProductDto'
import IProductDtoBuilder from './IProductDtoBuilder'
import { Timestamp } from 'firebase-admin/firestore'

export default class ProductDtoBuilder implements IProductDtoBuilder {
  private productDto!: ProductDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetProductDto: ProductDto = {
      id: undefined,
      name: undefined,
      description: undefined,
      image: undefined,
      price: undefined,
      quantity: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      store: {
        id: undefined,
        name: undefined
      },
      category: {
        id: undefined,
        name: undefined,
        parentName: undefined
      },
      discount: {
        id: undefined,
        percentage: undefined,
        startDate: undefined,
        endDate: undefined
      },
      paginationKey: undefined
    }
    this.productDto = resetProductDto
  }

  setName (name: string): IProductDtoBuilder {
    this.productDto.name = name
    return this
  }

  setDescription (description: string): IProductDtoBuilder {
    this.productDto.description = description
    return this
  }

  setImage (image: string): IProductDtoBuilder {
    this.productDto.image = image
    return this
  }

  setPrice (price: number): IProductDtoBuilder {
    this.productDto.price = price
    return this
  }

  setQuantity (quantity: number): IProductDtoBuilder {
    this.productDto.quantity = quantity
    return this
  }

  setCreatedAt (at: Timestamp): IProductDtoBuilder {
    this.productDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IProductDtoBuilder {
    this.productDto.updatedAt = at
    return this
  }

  setStoreID (id: string): IProductDtoBuilder {
    this.productDto.store.id = id
    return this
  }

  setStoreName (name: string): IProductDtoBuilder {
    this.productDto.store.name = name
    return this
  }

  setCategoryID (id: string): IProductDtoBuilder {
    this.productDto.category.id = id
    return this
  }

  setCategoryName (name: string): IProductDtoBuilder {
    this.productDto.category.name = name
    return this
  }

  setCategoryParentName (name: string): IProductDtoBuilder {
    this.productDto.category.parentName = name
    return this
  }

  setDiscountID (id: string): IProductDtoBuilder {
    this.productDto.discount.id = id
    return this
  }

  setDiscountPercentage (percentage: number): IProductDtoBuilder {
    this.productDto.discount.percentage = percentage
    return this
  }

  setDiscountStartDate (at: FirebaseFirestore.Timestamp): IProductDtoBuilder {
    this.productDto.discount.startDate = at
    return this
  }

  setDiscountEndDate (at: FirebaseFirestore.Timestamp): IProductDtoBuilder {
    this.productDto.discount.endDate = at
    return this
  }

  setPaginationKey (key: UUID): IProductDtoBuilder {
    this.productDto.paginationKey = key
    return this
  }

  build (): ProductDto {
    const result = this.productDto
    this.reset()
    return result
  }
}
