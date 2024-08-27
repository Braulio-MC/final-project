import { Errback, Request, Response, NextFunction } from 'express'
import { InvalidTokenError, UnauthorizedError, InsufficientScopeError } from 'express-oauth2-jwt-bearer'
import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '../core/ErrorResponse'

const errorHandler = (err: Errback, _req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) {
    return next(err)
  }
  if (err instanceof InsufficientScopeError) {
    const message = 'Insufficient permissions'
    res.status(err.statusCode).json(ErrorResponse.makeErrorResponse(message, err.statusCode))
  } else if (err instanceof InvalidTokenError) {
    const message = 'Expired or invalid token'
    res.status(err.statusCode).json(ErrorResponse.makeErrorResponse(message, err.statusCode))
  } else if (err instanceof UnauthorizedError) {
    const message = 'Authentication required'
    res.status(err.statusCode).json(ErrorResponse.makeErrorResponse(message, err.statusCode))
  } else if (err instanceof ErrorResponse) {
    res.status(err.statusCode).json(err.reason)
  } else {
    console.error(err) //! development only
    const message = 'Internal server error'
    const statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    res.status(statusCode).json(ErrorResponse.makeErrorResponse(message, statusCode))
  }
}

export default errorHandler
