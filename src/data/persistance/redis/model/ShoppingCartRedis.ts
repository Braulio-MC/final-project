import ShoppingCartStoreRedis from './ShoppingCartStoreRedis'

export default interface ShoppingCartRedis {
  id: string
  userId: string
  createdAt: number
  updatedAt: number
  store: ShoppingCartStoreRedis
  paginationKey: string
}
