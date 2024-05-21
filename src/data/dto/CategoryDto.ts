import { Timestamp } from 'firebase-admin/firestore'
import CategoryDtoParent from './CategoryDtoParent'

export default interface CategoryDto {
  id: string | undefined
  name: string | undefined
  parent: CategoryDtoParent
  storeId: string | undefined
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  paginationKey: string | undefined
}
