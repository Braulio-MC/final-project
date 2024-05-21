import OrderLineDto from './data/dto/OrderLineDto'

export interface ApiErrorResponse {
  code: number
  'reason phrase': string
  error: string
}

export interface OrderResult {
  id: string | undefined
  status: string | undefined
  total: number | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  store: OrderStoreDto
  user: OrderUserDto
  deliveryLocation: OrderDeliveryLocationDto
  paymentMethod: OrderPaymentMethodDto
  orderLines: OrderLineDto[] | undefined
  paginationKey: string | undefined
}

export interface ShoppingCartResult {
  id: string | undefined
  userId: string | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  store: ShoppingCartStoreDto
  products: ShoppingCartProductDto[] | undefined
  paginationKey: string | undefined
}

export interface PagingResult<T> {
  data: T[]
  pagination: {
    prev: string | null | undefined
    next: string | null | undefined
  }
}

export interface StoreSearchResult {
  id: string | undefined
  name: string | undefined
  phoneNumber: string | undefined
  email: string | undefined
}

export interface ProductSearchResult {
  id: string | undefined
  name: string | undefined
  categoryName: string | undefined
  storeName: string | undefined
}

export type SearchResult = Array<StoreSearchResult | ProductSearchResult>
