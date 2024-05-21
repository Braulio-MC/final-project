import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { ApiErrorResponse } from '../types'

export default class ErrorResponse extends Error {
  readonly statusCode: StatusCodes
  readonly reason: ApiErrorResponse

  constructor (error: string, statusCode: StatusCodes) {
    super(error)
    this.statusCode = statusCode
    this.reason = ErrorResponse.makeErrorResponse(error, statusCode)
    Error.captureStackTrace(this, this.constructor)
  }

  static makeErrorResponse (error: string, statusCode: StatusCodes): ApiErrorResponse {
    const reasonPhrase = getReasonPhrase(statusCode)
    const response: ApiErrorResponse = {
      code: statusCode,
      'reason phrase': reasonPhrase,
      error
    }
    return response
  }
}
