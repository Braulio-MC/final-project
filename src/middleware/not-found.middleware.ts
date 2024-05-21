import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '../core/ErrorResponse'

const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  const error = new ErrorResponse('Endpoint not found', StatusCodes.NOT_FOUND)
  next(error)
}

export default notFoundHandler
