import OrderStatuses from './OrderStatuses'

export const DEFAULT_PAGING_LIMIT = 10
export const DEFAULT_PAGING_AFTER = ''
export const DEFAULT_PAGING_BEFORE = ''
export const DEFAULT_SEARCH_QUERY = ''
export const DEFAULT_SEARCH_PER_PAGE = 5
export const CATEGORY_DELETE_ERROR_MESSAGE = 'There are products related to the category, update product category first'
export const DELIVERY_LOCATION_UPDATE_ERROR_MESSAGE = `Delivery location cannot be updated, there are active orders related to the location. Order status must be one of the following: ${OrderStatuses.DELIVERED} or ${OrderStatuses.CANCELLED}`
export const DELIVERY_LOCATION_DELETE_ERROR_MESSAGE = `There are orders related to the delivery location, orders must have the following status: ${OrderStatuses.DELIVERED} or ${OrderStatuses.CANCELLED}`
export const PRODUCT_DELETE_ERROR_MESSAGE = `There are orders related to the product, orders must have the following status: ${OrderStatuses.DELIVERED} or ${OrderStatuses.CANCELLED}`
export const STORE_UPDATE_ERROR_MESSAGE = `There are orders with active status: ${OrderStatuses.CREATED}, ${OrderStatuses.ACTIVE}, ${OrderStatuses.PROGRESS}, ${OrderStatuses.ON_WAY}, complete orders firts then update the store`
export const STORE_DELETE_ERROR_MESSAGE = `There are orders with active status: ${OrderStatuses.CREATED}, ${OrderStatuses.ACTIVE}, ${OrderStatuses.PROGRESS}, ${OrderStatuses.ON_WAY}, complete orders first`
export const ORDER_DELETE_ERROR_MESSAGE = `Order must be in one of the following status: ${OrderStatuses.DELIVERED} or ${OrderStatuses.CANCELLED}`
