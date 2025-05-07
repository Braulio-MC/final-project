import { Request, Response, NextFunction } from 'express'
import { inject, singleton } from 'tsyringe'
import TokenService from '../data/service/token/Token.service'
import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { expressErrorFormatter } from '../core/Utils'
import ErrorResponse from '../core/ErrorResponse'
import AlgoliaSecuredSearchKeyScopeConfigMap from '../core/AlgoliaSecuredSearchKeyScopeConfigMap'
import { AlgoliaHelper } from '../core/AlgoliaHelper'

@singleton()
export default class TokenController {
  constructor (
    @inject(TokenService) private readonly service: TokenService,
    @inject(AlgoliaHelper) private readonly algoliaHelper: AlgoliaHelper
  ) {}

  create (req: Request, res: Response, next: NextFunction): void {
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

  getAlgoliaSecuredSearchApiKey (req: Request, res: Response, _next: NextFunction): void {
    const userId = req.auth?.payload?.sub
    const { scopeType } = req.body
    const scopeConfig = AlgoliaSecuredSearchKeyScopeConfigMap[scopeType]
    let filterValue: string

    if (userId === undefined || userId === '') {
      res.status(StatusCodes.BAD_REQUEST).json('User ID is required')
    }

    if (scopeConfig === undefined) {
      res.status(StatusCodes.BAD_REQUEST).json('Invalid scope type')
    }

    switch (scopeConfig.valueSource) {
      case 'userId':
        filterValue = userId as string
        break
    }

    if (filterValue === undefined || filterValue === '') {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: `Missing value for ${scopeConfig.valueSource}`
      })
    }

    const filters = `${scopeConfig.filterField}:${filterValue}`
    const restrictions: any = {
      filters,
      validUntil: Math.floor(Date.now() / 1000) + 60 * 60 * 5, // 5 hours
      userToken: userId
    }
    if (scopeConfig.restrictIndices !== undefined) {
      restrictions.restrictIndices = scopeConfig.restrictIndices
    }
    try {
      const userScopedSecApiKey = this.algoliaHelper.client.generateSecuredApiKey({
        parentApiKey: process.env.ALGOLIA_SEARCH_API_KEY as string,
        restrictions
      })
      res.status(StatusCodes.OK).json(userScopedSecApiKey)
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to generate secured API key', details: error
      })
    }
  }
}
