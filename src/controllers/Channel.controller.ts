import { Request, Response, NextFunction } from 'express'
import { inject, singleton } from 'tsyringe'
import ChannelService from '../data/service/channel/Channel.service'
import { validationResult } from 'express-validator'
import { expressErrorFormatter } from '../core/Utils'
import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '../core/ErrorResponse'

@singleton()
export default class ChannelController {
  constructor (
    @inject(ChannelService) private readonly service: ChannelService
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const { type, id, options } = req.body
      this.service.create(type, id, options)
        .then(id => {
          res.status(StatusCodes.CREATED).json(id)
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

  async createDistinct (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const { type, members } = req.body
      this.service.createDistinct(type, members)
        .then(id => {
          res.status(StatusCodes.CREATED).json(id)
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
