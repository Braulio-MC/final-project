import { inject, singleton } from 'tsyringe'
import ISearchRepository from '../repository/search/ISearchRepository'
import { SearchResult } from '../../types'

@singleton()
export default class SearchService {
  constructor (
    @inject('SearchRepository') private readonly repository: ISearchRepository
  ) {}

  async search (query: string, perPage: number): Promise<SearchResult> {
    const result = await this.repository.search(query, perPage)
    return result
  }
}
