import IRepository from '../IRepository'
import ProductDto from '../../dto/ProductDto'
import { ProductSearchResult } from '../../../types'

export default interface IProductRepository extends IRepository<ProductDto> {
  search: (query: string, perPage: number) => Promise<ProductSearchResult[]>
}
