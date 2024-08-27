import algoliasearch from 'algoliasearch/lite'
import { algoliaConfig } from './Configuration'

export const algoliaClient = algoliasearch(algoliaConfig.applicationId as string, algoliaConfig.apiKey as string)
export const algoliaIndex = algoliaClient.initIndex(algoliaConfig.index as string)
