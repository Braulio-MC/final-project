import { inject, singleton } from 'tsyringe'
import ISearchRepository from '../repository/search/ISearchRepository'
import { SearchResult, SearchResultContent, SearchResultContentRedis, SearchResultRedis } from '../../types'
import RedisRepository from '../persistance/redis/RedisRepository'
import mapper from '../../core/Mapper'
import { REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS } from '../../core/Constants'

@singleton()
export default class SearchService {
  constructor (
    @inject('SearchRepository') private readonly repository: ISearchRepository,
    @inject(RedisRepository) private readonly redisRepository: RedisRepository
  ) {}

  async search (query: string, page: number, perPage: number): Promise<SearchResult> {
    const cachedKey = `search_search_${query}_${page}_${perPage}`
    const cachedResult = await this.redisRepository.get<SearchResultRedis>(cachedKey)
    if (cachedResult != null) {
      const result: SearchResult = {
        data: cachedResult.data.map(dto => mapper.map<SearchResultContentRedis, SearchResultContent>(dto, 'SearchResultContentRedis', 'SearchResultContent')),
        pagination: {
          currentPage: cachedResult.pagination.currentPage,
          nbPages: cachedResult.pagination.nbPages,
          nbHits: cachedResult.pagination.nbHits
        }
      }
      return result
    }
    const result = await this.repository.search(query, page, perPage)
    const cacheValue: SearchResultRedis = {
      data: result.data.map(dto => mapper.map<SearchResultContent, SearchResultContentRedis>(dto, 'SearchResultContent', 'SearchResultContentRedis')),
      pagination: {
        currentPage: result.pagination.currentPage,
        nbPages: result.pagination.nbPages,
        nbHits: result.pagination.nbHits
      }
    }
    await this.redisRepository.set(cachedKey, cacheValue, { ttl: REDIS_DATA_CACHE_EXPIRATION_IN_MILLIS })
    return result
  }
}
