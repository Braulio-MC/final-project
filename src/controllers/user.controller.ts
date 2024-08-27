import { Request, Response, NextFunction } from 'express'
import { inject, singleton } from 'tsyringe'
import UserService from '../data/service/user/User.service'
import { validationResult } from 'express-validator'
import { expressErrorFormatter } from '../core/Utils'
import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '../core/ErrorResponse'

@singleton()
export default class UserController {
  constructor (
    @inject(UserService) private readonly service: UserService
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const { users } = req.body
      this.service.create(users)
        .then(_ => {
          res.sendStatus(StatusCodes.CREATED)
        })
        .catch(e => {
          const error = new ErrorResponse(e.message, StatusCodes.UNPROCESSABLE_ENTITY)
          next(error)
        })
    } else {
      const errorsFormat = errors.array().join(', ')
      const error = new ErrorResponse(errorsFormat, StatusCodes.BAD_REQUEST)
      next(error)
    }
  }
}
