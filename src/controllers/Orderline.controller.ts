import { inject, singleton } from 'tsyringe'
import IController from './IController'
import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { expressErrorFormatter } from '../core/Utils'
import { randomUUID } from 'crypto'
import moment from 'moment'
import { Timestamp } from 'firebase-admin/firestore'
import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '../core/ErrorResponse'
import { DEFAULT_PAGING_AFTER, DEFAULT_PAGING_BEFORE, DEFAULT_PAGING_LIMIT } from '../core/Constants'
import Filters from '../core/criteria/Filters'
import Filter from '../core/criteria/Filter'
import FieldPath from '../core/criteria/FieldPath'
import FilterOperator from '../core/criteria/FilterOperator'
import Order from '../core/criteria/Order'
import Criteria from '../core/criteria/Criteria'
import OrderLineDtoBuilder from '../core/builder/orderline/OrderLineDtoBuilder'
import IOrderlineService from '../data/service/orderline/IOrderlineService'

@singleton()
export default class OrderlineController implements IController {
  constructor (
    @inject('OrderlineService') private readonly service: IOrderlineService,
    @inject(OrderLineDtoBuilder) private readonly orderlineBuilder: OrderLineDtoBuilder
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const { orderId } = req.params
      const { total, quantity, productId, productName, productImage, productPrice } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const newOrderline = this.orderlineBuilder
        .setTotal(total)
        .setQuantity(quantity)
        .setProductId(productId)
        .setProductName(productName)
        .setProductImage(productImage)
        .setProductPrice(productPrice)
        .setCreatedAt(at)
        .setUpdatedAt(at)
        .setPaginationKey(randomUUID())
        .build()
      this.service.create(newOrderline, orderId)
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

  async update (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const { orderId, lineId } = req.params
      const { total, quantity, productId, productName, productImage, productPrice } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const updateOrderline = this.orderlineBuilder
        .setTotal(total)
        .setQuantity(quantity)
        .setProductId(productId)
        .setProductName(productName)
        .setProductImage(productImage)
        .setProductPrice(productPrice)
        .setUpdatedAt(at)
        .build()
      this.service.update(orderId, updateOrderline, lineId)
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
    const { orderId, lineId } = req.params
    this.service.delete(orderId, lineId)
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
      const { orderId, lineId } = req.params
      const orderline = await this.service.findById(orderId, lineId)
      if (orderline !== null) {
        res.status(StatusCodes.OK).json(orderline)
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
        const orderlines = await this.service.paging(limit, after, before)
        res.status(StatusCodes.OK).json(orderlines)
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

  async existsByCriteria (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      try {
        const { filters, order } = req.body
        const filterList = new Filters()
        filters.forEach(({ field, operator, value }: { field: string[], operator: string, value: any }) => {
          filterList.add(new Filter(new FieldPath(...field), FilterOperator.fromValue(operator), value))
        })
        const sort = Order.fromValues(order.orderBy, order.orderType)
        const criteria = new Criteria(filterList, 1, sort)
        const orderline = await this.service.existsByCriteria(criteria)
        res.status(StatusCodes.OK).json(orderline)
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
        const criteria = new Criteria(filterList, limit, sort, after, before)
        const orderlines = await this.service.pagingByCriteria(criteria)
        res.status(StatusCodes.OK).json(orderlines)
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
