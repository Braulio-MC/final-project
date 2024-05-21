import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'

export default interface IService<T, R> {
  create: (item: T) => Promise<void>
  update: (id: string, item: Partial<T>) => Promise<void>
  paging: (limit: number, after: string, before: string) => Promise<PagingResult<R>>
  findById: (id: string) => Promise<R | null>
  delete: (id: string) => Promise<void>
  pagingByCriteria: (criteria: Criteria) => Promise<PagingResult<R>>
}
