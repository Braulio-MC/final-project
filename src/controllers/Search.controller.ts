import { inject, singleton } from 'tsyringe'
import SearchService from '../data/service/Search.service'
import { NextFunction, Request, Response } from 'express'
import { DEFAULT_SEARCH_PAGE, DEFAULT_SEARCH_PER_PAGE, DEFAULT_SEARCH_QUERY } from '../core/Constants'
import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '../core/ErrorResponse'
import { validationResult } from 'express-validator'
import { expressErrorFormatter } from '../core/Utils'

@singleton()
export default class SearchController {
  constructor (
    @inject(SearchService) private readonly service: SearchService
  ) {}

  async search (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      try {
        const query = req.query.query as string ?? DEFAULT_SEARCH_QUERY
        let page = DEFAULT_SEARCH_PAGE
        let perPage = DEFAULT_SEARCH_PER_PAGE
        if (!isNaN(parseInt(req.query.page as string)) && !isNaN(parseInt(req.query.perPage as string))) {
          page = Math.abs(parseInt(req.query.page as string))
          perPage = Math.abs(parseInt(req.query.perPage as string))
        }
        const result = await this.service.search(query, page, perPage)
        res.status(StatusCodes.OK).json(result)
      } catch (e: any) {
        const error = new ErrorResponse(e.message, StatusCodes.UNPROCESSABLE_ENTITY)
        next(error)
      }
    } else {
      const errorsFormat = errors.array().join(', ')
      const error = new ErrorResponse(errorsFormat, StatusCodes.BAD_REQUEST)
      next(error)
    }
  }
}
