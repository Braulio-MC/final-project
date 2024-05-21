import { StoreSearchResult } from '../../../types'
import StoreDto from '../../dto/StoreDto'
import IRepository from '../IRepository'

export default interface IStoreRepository extends IRepository<StoreDto> {
  search: (query: string, perPage: number) => Promise<StoreSearchResult[]>
}
