import { GetSecuredSearchKeyScopeConfig } from '../types'

const AlgoliaSecuredSearchKeyScopeConfigMap: Record<string, GetSecuredSearchKeyScopeConfig> = {
  userIdNested: {
    filterField: 'user.id',
    valueSource: 'userId',
    restrictIndices: ['prod_buena_cocina_orders']
  },
  storeOwnerIdNested: {
    filterField: 'store.ownerId',
    valueSource: 'userId',
    restrictIndices: ['prod_buena_cocina_orders']
  }
}

export default AlgoliaSecuredSearchKeyScopeConfigMap
