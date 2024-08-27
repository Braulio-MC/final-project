export default interface ShoppingCartProductRedis {
  objectId: string // Doc id
  id: string // Product id
  name: string
  image: URL
  price: number
  quantity: number
  createdAt: number
  updatedAt: number
  paginationKey: string
}
