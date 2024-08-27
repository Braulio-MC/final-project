import { Request, Response, NextFunction } from 'express'
import { inject, singleton } from 'tsyringe'
import TokenService from '../data/service/token/Token.service'
import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { expressErrorFormatter } from '../core/Utils'
import ErrorResponse from '../core/ErrorResponse'

@singleton()
export default class TokenController {
  constructor (
    @inject(TokenService) private readonly service: TokenService
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const { userId } = req.body
      const token = this.service.getToken(userId)
      res.status(StatusCodes.OK).json(token)
    } else {
      const errorsFormat = errors.array().join(', ')
      const error = new ErrorResponse(errorsFormat, StatusCodes.BAD_REQUEST)
      next(error)
    }
  }
}
