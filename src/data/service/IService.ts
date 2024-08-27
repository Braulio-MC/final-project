import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'

export default interface IService<T, R> {
  create: (item: T, id?: string) => Promise<string>
  update: (id: string, item: Partial<T>, nestedId?: string) => Promise<void>
  paging: (limit: number, after: string, before: string) => Promise<PagingResult<R>>
  findById: (id: string, nestedId?: string) => Promise<R | null>
  delete: (id: string, nested?: string) => Promise<void>
  existsByCriteria: (criteria: Criteria) => Promise<boolean>
  pagingByCriteria: (criteria: Criteria) => Promise<PagingResult<R>>
}
