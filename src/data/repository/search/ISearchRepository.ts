import { SearchResult } from '../../../types'

export default interface ISearchRepository {
  search: (query: string, page: number, perPage: number) => Promise<SearchResult>
}
