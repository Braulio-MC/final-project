import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { Timestamp } from 'firebase-admin/firestore'
import { inject, singleton } from 'tsyringe'
import ProductService from '../data/service/Product.service'
import { NextFunction, Request, Response } from 'express'
import ProductDtoBuilder from '../core/builder/product/ProductDtoBuilder'
import moment from 'moment'
import Filters from '../core/criteria/Filters'
import Filter from '../core/criteria/Filter'
import FieldPath from '../core/criteria/FieldPath'
import FilterOperator from '../core/criteria/FilterOperator'
import Order from '../core/criteria/Order'
import Criteria from '../core/criteria/Criteria'
import ErrorResponse from '../core/ErrorResponse'
import { expressErrorFormatter } from '../core/Utils'
import {
  DEFAULT_PAGING_AFTER,
  DEFAULT_PAGING_BEFORE,
  DEFAULT_PAGING_LIMIT,
  DEFAULT_SEARCH_PER_PAGE,
  DEFAULT_SEARCH_QUERY
} from '../core/Constants'
import { randomUUID } from 'crypto'
import IController from './IController'

@singleton()
export default class ProductController implements IController {
  constructor (
    @inject(ProductService) private readonly service: ProductService,
    @inject(ProductDtoBuilder) private readonly builder: ProductDtoBuilder
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const {
        name,
        description,
        image,
        price,
        quantity,
        storeId,
        storeName,
        categoryId,
        categoryName,
        categoryParentName,
        discountId,
        discountPercentage,
        discountStartDate,
        discountEndDate
      } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const startDate = Timestamp.fromDate(new Date(discountStartDate))
      const endDate = Timestamp.fromDate(new Date(discountEndDate))
      const newProduct = this.builder
        .setName(name)
        .setDescription(description)
        .setImage(image)
        .setPrice(price)
        .setQuantity(quantity)
        .setStoreID(storeId)
        .setStoreName(storeName)
        .setCategoryID(categoryId)
        .setCategoryName(categoryName)
        .setCategoryParentName(categoryParentName)
        .setDiscountID(discountId)
        .setDiscountPercentage(discountPercentage)
        .setDiscountStartDate(startDate)
        .setDiscountEndDate(endDate)
        .setCreatedAt(at)
        .setUpdatedAt(at)
        .setPaginationKey(randomUUID())
        .build()
      this.service.create(newProduct)
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
      const {
        name,
        description,
        image,
        price,
        quantity,
        storeId,
        storeName,
        categoryId,
        categoryName,
        categoryParentName,
        discountId,
        discountPercentage,
        discountStartDate,
        discountEndDate
      } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const startDate = Timestamp.fromDate(new Date(discountStartDate))
      const endDate = Timestamp.fromDate(new Date(discountEndDate))
      const updateProduct = this.builder
        .setName(name)
        .setDescription(description)
        .setImage(image)
        .setPrice(price)
        .setQuantity(quantity)
        .setStoreID(storeId)
        .setStoreName(storeName)
        .setCategoryID(categoryId)
        .setCategoryName(categoryName)
        .setCategoryParentName(categoryParentName)
        .setDiscountID(discountId)
        .setDiscountPercentage(discountPercentage)
        .setDiscountStartDate(startDate)
        .setDiscountEndDate(endDate)
        .setUpdatedAt(at)
        .build()
      this.service.update(id, updateProduct)
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
      const product = await this.service.findById(id)
      if (product !== null) {
        res.status(StatusCodes.OK).json(product)
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
        const products = await this.service.paging(limit, after, before)
        res.status(StatusCodes.OK).json(products)
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
        const products = await this.service.pagingByCriteria(criteria)
        res.status(StatusCodes.OK).json(products)
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

  async search (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      try {
        const query = req.query.query as string ?? DEFAULT_SEARCH_QUERY
        let perPage = DEFAULT_SEARCH_PER_PAGE
        if (!isNaN(parseInt(req.query.perPage as string))) {
          perPage = Math.abs(parseInt(req.query.perPage as string))
        }
        const result = await this.service.search(query, perPage)
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
