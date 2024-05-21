import { Timestamp } from 'firebase-admin/firestore'
import { UUID } from 'crypto'

export interface IBaseBuilder<R1, R2> {
  setCreatedAt: (at: Timestamp) => R1
  setUpdatedAt: (at: Timestamp) => R1
  setPaginationKey: (key: UUID) => R1
  build: () => R2
}
