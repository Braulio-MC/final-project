import { Timestamp } from 'firebase-admin/firestore'
import ProductFavoriteDto from '../../../data/dto/ProductFavoriteDto'
import IProductFavoriteDtoBuilder from './IProductFavoriteDtoBuilder'
import { UUID } from 'crypto'

export default class ProductFavoriteDtoBuilder implements IProductFavoriteDtoBuilder {
  private productFavoriteDto!: ProductFavoriteDto

  constructor () {
    this.reset()
  }

  private reset (): void {
    const resetProductFavoriteDto: ProductFavoriteDto = {
      id: undefined,
      userId: undefined,
      productId: undefined,
      productName: undefined,
      productImage: undefined,
      productDescription: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      paginationKey: undefined
    }
    this.productFavoriteDto = resetProductFavoriteDto
  }

  setUserId (id: string): IProductFavoriteDtoBuilder {
    this.productFavoriteDto.userId = id
    return this
  }

  setProductId (id: string): IProductFavoriteDtoBuilder {
    this.productFavoriteDto.productId = id
    return this
  }

  setProductName (name: string): IProductFavoriteDtoBuilder {
    this.productFavoriteDto.productName = name
    return this
  }

  setProductImage (image: URL): IProductFavoriteDtoBuilder {
    this.productFavoriteDto.productImage = image
    return this
  }

  setProductDescription (description: string): IProductFavoriteDtoBuilder {
    this.productFavoriteDto.productDescription = description
    return this
  }

  setCreatedAt (at: Timestamp): IProductFavoriteDtoBuilder {
    this.productFavoriteDto.createdAt = at
    return this
  }

  setUpdatedAt (at: Timestamp): IProductFavoriteDtoBuilder {
    this.productFavoriteDto.updatedAt = at
    return this
  }

  setPaginationKey (key: UUID): IProductFavoriteDtoBuilder {
    this.productFavoriteDto.paginationKey = key
    return this
  }

  build (): ProductFavoriteDto {
    const result = this.productFavoriteDto
    this.reset()
    return result
  }
}
