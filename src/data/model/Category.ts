import CategoryParent from './CategoryParent'

export default interface Category {
  id: string
  name: string
  parent: CategoryParent
  storeId: string
  createdAt: Date
  updatedAt: Date
  paginationKey: string
}
