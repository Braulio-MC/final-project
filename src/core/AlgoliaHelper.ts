import { singleton } from 'tsyringe'
import { algoliasearch, SearchClient } from 'algoliasearch'

@singleton()
export class AlgoliaHelper {
  private _client: SearchClient | null = null

  private get clientInstance (): SearchClient {
    if (this._client == null) {
      const appId = process.env.ALGOLIA_APPLICATION_ID
      const searchKey = process.env.ALGOLIA_SEARCH_API_KEY

      if ((appId == null) || (searchKey == null)) {
        throw new Error('Algolia credentials not configured')
      }

      this._client = algoliasearch(appId, searchKey)
    }
    return this._client
  }

  get client (): SearchClient {
    return this.clientInstance
  }
}
