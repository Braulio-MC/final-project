import { inject, singleton } from 'tsyringe'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { validationResult } from 'express-validator'
import moment from 'moment'
import { Timestamp } from 'firebase-admin/firestore'
import ProductFavoriteService from '../data/service/ProductFavorite.service'
import ProductFavoriteDtoBuilder from '../core/builder/productFavorite/ProductFavoriteDtoBuilder'
import Filters from '../core/criteria/Filters'
import Filter from '../core/criteria/Filter'
import FieldPath from '../core/criteria/FieldPath'
import FilterOperator from '../core/criteria/FilterOperator'
import Order from '../core/criteria/Order'
import Criteria from '../core/criteria/Criteria'
import { expressErrorFormatter } from '../core/Utils'
import ErrorResponse from '../core/ErrorResponse'
import { DEFAULT_PAGING_AFTER, DEFAULT_PAGING_BEFORE, DEFAULT_PAGING_LIMIT } from '../core/Constants'
import { randomUUID } from 'crypto'
import IController from './IController'

@singleton()
export default class ProductFavoriteController implements IController {
  constructor (
    @inject(ProductFavoriteService) private readonly service: ProductFavoriteService,
    @inject(ProductFavoriteDtoBuilder) private readonly builder: ProductFavoriteDtoBuilder
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const { userId, productId, productName, productImage, productDescription } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const newProductFavorite = this.builder
        .setUserId(userId)
        .setProductId(productId)
        .setProductName(productName)
        .setProductImage(productImage)
        .setProductDescription(productDescription)
        .setCreatedAt(at)
        .setUpdatedAt(at)
        .setPaginationKey(randomUUID())
        .build()
      this.service.create(newProductFavorite)
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

  async update (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const { id } = req.params
      const { userId, productId, productName, productImage, productDescription } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const updateProductFavorite = this.builder
        .setUserId(userId)
        .setProductId(productId)
        .setProductName(productName)
        .setProductImage(productImage)
        .setProductDescription(productDescription)
        .setUpdatedAt(at)
        .build()
      this.service.update(id, updateProductFavorite)
        .then(_ => {
          res.sendStatus(StatusCodes.OK)
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

  async delete (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params
    this.service.delete(id)
      .then(_ => {
        res.sendStatus(StatusCodes.OK)
      })
      .catch(e => {
        const error = new ErrorResponse(e.message, StatusCodes.UNPROCESSABLE_ENTITY)
        next(error)
      })
  }

  async findById (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const productFavorite = this.service.findById(id)
      if (productFavorite !== null) {
        res.status(StatusCodes.OK).json(productFavorite)
      } else {
        const error = new ErrorResponse('Resource not found', StatusCodes.NOT_FOUND)
        next(error)
      }
    } catch (e: any) {
      const error = new ErrorResponse(e.message, StatusCodes.UNPROCESSABLE_ENTITY)
      next(error)
    }
  }

  async paging (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      try {
        let limit = DEFAULT_PAGING_LIMIT
        const after = req.query.after as string ?? DEFAULT_PAGING_AFTER
        const before = req.query.before as string ?? DEFAULT_PAGING_BEFORE
        if (!isNaN(parseInt(req.query.limit as string))) {
          limit = Math.abs(parseInt(req.query.limit as string))
        }
        const productFavorites = await this.service.paging(limit, after, before)
        res.status(StatusCodes.OK).json(productFavorites)
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

  async pagingByCriteria (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      try {
        const { filters, order } = req.body
        let limit = DEFAULT_PAGING_LIMIT
        const after = req.query.after as string ?? DEFAULT_PAGING_AFTER
        const before = req.query.before as string ?? DEFAULT_PAGING_BEFORE
        if (!isNaN(parseInt(req.query.limit as string))) {
          limit = Math.abs(parseInt(req.query.limit as string))
        }
        const filterList = new Filters()
        filters.forEach(({ field, operator, value }: { field: string[], operator: string, value: any }) => {
          filterList.add(new Filter(new FieldPath(...field), FilterOperator.fromValue(operator), value))
        })
        const sort = Order.fromValues(order.orderBy, order.orderType)
        const criteria = new Criteria(filterList, sort, limit, after, before)
        const productFavorites = await this.service.pagingByCriteria(criteria)
        res.status(StatusCodes.OK).json(productFavorites)
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
