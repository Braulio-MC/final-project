import CategoryParentRedis from './CategoryParentRedis'

export default interface CategoryRedis {
  id: string
  name: string
  parent: CategoryParentRedis
  storeId: string
  createdAt: number
  updatedAt: number
  paginationKey: string
}
