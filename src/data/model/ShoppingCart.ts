import ShoppingCartProduct from './ShoppingCartProduct'
import ShoppingCartStore from './ShoppingCartStore'

export default interface ShoppingCart {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
  store: ShoppingCartStore
  products: ShoppingCartProduct[]
  paginationKey: string
}
