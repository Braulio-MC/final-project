import { SearchResult } from '../../../types'

export default interface ISearchRepository {
  search: (query: string, perPage: number) => Promise<SearchResult>
}
