import { SearchIndex } from 'algoliasearch'
import { inject, singleton } from 'tsyringe'
import ISearchRepository from './ISearchRepository'
import { SearchResult, SearchResultContent } from '../../../types'

@singleton()
export default class FirestoreSearchRepository implements ISearchRepository {
  constructor (
    @inject('AlgoliaIndex') private readonly index: SearchIndex
  ) {}

  async search (query: string, page: number, perPage: number): Promise<SearchResult> {
    const result = await this.index.search(query, {
      page,
      hitsPerPage: perPage
    })
    const hits: SearchResultContent[] = []
    result.hits.forEach(resultData => {
      const collection = 'path' in resultData ? (resultData.path as string).split('/')[0] : ''
      if (collection === 'stores') {
        const store: SearchResultContent = {
          id: resultData.objectID,
          name: 'name' in resultData ? resultData.name as string : '',
          image: 'image' in resultData ? resultData.image as string : '',
          type: collection,
          description1: 'phoneNumber' in resultData ? resultData.phoneNumber as string : '',
          description2: 'email' in resultData ? resultData.email as string : ''
        }
        hits.push(store)
      } else {
        const product: SearchResultContent = {
          id: resultData.objectID,
          name: 'name' in resultData ? resultData.name as string : '',
          image: 'image' in resultData ? resultData.image as string : '',
          type: collection,
          description1: 'category.name' in resultData ? resultData['category.name'] as string : '',
          description2: 'store.name' in resultData ? resultData['store.name'] as string : ''
        }
        hits.push(product)
      }
    })
    const searchResult: SearchResult = {
      data: hits,
      pagination: {
        currentPage: result.page,
        nbPages: result.nbPages,
        nbHits: result.nbHits
      }
    }
    return searchResult
  }
}
