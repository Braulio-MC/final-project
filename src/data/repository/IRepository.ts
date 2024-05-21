import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'

export default interface IRepository<T> {
  create: (item: T) => Promise<void>
  update: (id: string, item: Partial<T>) => Promise<void>
  paging: (limit: number, after: string, before: string) => Promise<PagingResult<T>>
  findById: (id: string) => Promise<T | null>
  delete: (id: string) => Promise<void>
  pagingByCriteria: (criteria: Criteria) => Promise<PagingResult<T>>
}
