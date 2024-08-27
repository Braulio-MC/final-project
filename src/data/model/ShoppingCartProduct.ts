export default interface ShoppingCartProduct {
  objectId: string // Doc id
  id: string // Product id
  name: string
  image: string
  price: number
  quantity: number
  createdAt: Date
  updatedAt: Date
  paginationKey: string
}
