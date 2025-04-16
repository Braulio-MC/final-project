import { algoliasearch } from 'algoliasearch'
import { algoliaConfig } from './Configuration'

export const algoliaClient = algoliasearch(algoliaConfig.applicationId as string, algoliaConfig.apiKey as string)
