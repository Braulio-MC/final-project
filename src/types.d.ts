import GetStreamMessagingUserRoleTypes from './core/GetStreamMessagingUserRoleTypes'

export interface GetStreamUser {
  id: string
  name: string
  role: GetStreamMessagingUserRoleTypes
}

export interface ApiErrorResponse {
  code: number
  'reason phrase': string
  error: string
}

export interface GetSecuredSearchKeyScopeConfig {
  filterField: string
  valueSource: 'userId'
  restrictIndices?: string[]
}
