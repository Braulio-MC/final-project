import { Timestamp } from 'firebase-admin/firestore'
import { IBaseBuilder } from '../IBaseBuilder'
import ProductDto from '../../../data/dto/ProductDto'

export default interface IProductDtoBuilder extends IBaseBuilder<IProductDtoBuilder, ProductDto> {
  setName: (name: string) => IProductDtoBuilder
  setDescription: (description: string) => IProductDtoBuilder
  setImage: (image: string) => IProductDtoBuilder
  setPrice: (price: number) => IProductDtoBuilder
  setQuantity: (quantity: number) => IProductDtoBuilder
  setStoreID: (id: string) => IProductDtoBuilder
  setStoreName: (name: string) => IProductDtoBuilder
  setCategoryID: (id: string) => IProductDtoBuilder
  setCategoryName: (name: string) => IProductDtoBuilder
  setCategoryParentName: (name: string) => IProductDtoBuilder
  setDiscountID: (id: string) => IProductDtoBuilder
  setDiscountPercentage: (percentage: number) => IProductDtoBuilder
  setDiscountStartDate: (at: Timestamp) => IProductDtoBuilder
  setDiscountEndDate: (at: Timestamp) => IProductDtoBuilder
}
