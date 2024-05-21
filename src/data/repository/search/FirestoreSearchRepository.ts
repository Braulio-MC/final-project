import { SearchClient } from 'algoliasearch'
import { inject, singleton } from 'tsyringe'
import { algoliaConfig } from '../../../core/Configuration'
import ISearchRepository from './ISearchRepository'
import { ProductSearchResult, SearchResult, StoreSearchResult } from '../../../types'

@singleton()
export default class FirestoreSearchRepository implements ISearchRepository {
  constructor (
    @inject('AlgoliaClient') private readonly client: SearchClient
  ) {}

  async search (query: string, perPage: number): Promise<SearchResult> {
    const queries = [{
      indexName: algoliaConfig.storeIndex as string,
      query,
      params: {
        hitsPerPage: perPage
      }
    }, {
      indexName: algoliaConfig.productIndex as string,
      query,
      params: {
        hitsPerPage: perPage
      }
    }]
    const result = await this.client.multipleQueries(queries)
    const hits: SearchResult = []
    result.results.forEach(resultData => {
      if ('hits' in resultData) {
        resultData.hits.forEach(hit => {
          const collection = 'path' in hit ? (hit.path as string).split('/')[0] : ''
          if (collection === 'stores') {
            const store: StoreSearchResult = {
              id: 'objectID' in hit ? hit.objectID : '',
              name: 'name' in hit ? hit.name as string : '',
              phoneNumber: 'phoneNumber' in hit ? hit.phoneNumber as string : '',
              email: 'email' in hit ? hit.email as string : ''
            }
            hits.push(store)
          } else {
            const product: ProductSearchResult = {
              id: 'objectID' in hit ? hit.objectID : '',
              name: 'name' in hit ? hit.name as string : '',
              categoryName: 'category.name' in hit ? hit['category.name'] as string : '',
              storeName: 'store.name' in hit ? hit['store.name'] as string : ''
            }
            hits.push(product)
          }
        })
      }
    })
    return hits
  }
}
