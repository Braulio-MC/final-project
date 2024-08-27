import { Timestamp, WhereFilterOp } from 'firebase-admin/firestore'
import OrderLineDto from './data/dto/OrderLineDto'
import OrderStoreDto from './data/dto/OrderStoreDto'
import OrderUserDto from './data/dto/OrderUserDto'
import OrderDeliveryLocationDto from './data/dto/OrderDeliveryLocationDto'
import OrderPaymentMethodDto from './data/dto/OrderPaymentMethodDto'
import ShoppingCartStoreDto from './data/dto/ShoppingCartStoreDto'
import ShoppingCartProductDto from './data/dto/ShoppingCartProductDto'
import OrderStoreRedis from './data/persistance/redis/model/OrderStoreRedis'
import OrderUserRedis from './data/persistance/redis/model/OrderUserRedis'
import OrderDeliveryLocationRedis from './data/persistance/redis/model/OrderDeliveryLocationRedis'
import OrderPaymentMethodRedis from './data/persistance/redis/model/OrderPaymentMethodRedis'
import OrderLineRedis from './data/persistance/redis/model/OrderLineRedis'
import ShoppingCartStoreRedis from './data/persistance/redis/model/ShoppingCartStoreRedis'
import ShoppingCartProductRedis from './data/persistance/redis/model/ShoppingCartProductRedis'
import GetStreamMessagingUserRoleTypes from './core/GetStreamMessagingUserRoleTypes'

export type FirestoreSortDirection = 'asc' | 'desc'
export type TransformerFunction<T, R> = (value: T) => R
export type RedisxTrimStrategy = 'MAXLEN' | 'MINID'
export type RedisxTrimStrategyModifier = '=' | '~'

export interface RedisStreamReadResult {
  name: string
  messages: Array<{
    id: string
    message: {
      [x: string]: string
    }
  }>
}

export interface RedisStreamRangeResult {
  id: string
  message: {
    [x: string]: string
  }
}

export interface GetStreamUser {
  id: string
  name: string
  role: GetStreamMessagingUserRoleTypes
}

export interface FirestoreFilter {
  field: string | FieldPath
  operator: WhereFilterOp
  value: any
}

export interface FirestoreSort {
  field: string
  direction: FirestoreSortDirection
}

export interface FirestoreQuery {
  filters: FirestoreFilter[]
  sort: FirestoreSort
  limit: number
  after: string
  before: string
}

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

export interface OrderResultRedis {
  id: string
  status: string
  total: number
  createdAt: number
  updatedAt: number
  store: OrderStoreRedis
  user: OrderUserRedis
  deliveryLocation: OrderDeliveryLocationRedis
  paymentMethod: OrderPaymentMethodRedis
  orderLines: OrderLineRedis[]
  paginationKey: string
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

export interface ShoppingCartResultRedis {
  id: string
  userId: string
  createdAt: number
  updatedAt: number
  store: ShoppingCartStoreRedis
  products: ShoppingCartProductRedis[]
  paginationKey: string
}

export interface PagingResult<T> {
  data: T[]
  pagination: {
    prev: string | null | undefined
    next: string | null | undefined
  }
}

export interface SearchResultContent {
  id: string | undefined
  name: string | undefined
  image: string | undefined
  type: string | undefined
  description1: string | undefined
  description2: string | undefined
}

export interface SearchResultContentRedis {
  id: string
  name: string
  image: string
  type: string
  description1: string
  description2: string
}

export interface SearchResultPagination {
  currentPage: number
  nbPages: number
  nbHits: number
}

export interface SearchResultPaginationRedis {
  currentPage: number
  nbPages: number
  nbHits: number
}

export interface SearchResult {
  data: SearchResultContent[]
  pagination: SearchResultPagination
}

export interface SearchResultRedis {
  data: SearchResultContentRedis[]
  pagination: SearchResultPaginationRedis
}
