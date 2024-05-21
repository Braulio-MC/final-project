import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { Timestamp } from 'firebase-admin/firestore'
import { Request, Response, NextFunction } from 'express'
import { inject, singleton } from 'tsyringe'
import OrderService from '../data/service/Order.service'
import OrderDtoBuilder from '../core/builder/order/OrderDtoBuilder'
import moment from 'moment'
import Filters from '../core/criteria/Filters'
import Filter from '../core/criteria/Filter'
import FieldPath from '../core/criteria/FieldPath'
import FilterOperator from '../core/criteria/FilterOperator'
import Order from '../core/criteria/Order'
import Criteria from '../core/criteria/Criteria'
import ErrorResponse from '../core/ErrorResponse'
import { expressErrorFormatter } from '../core/Utils'
import { DEFAULT_PAGING_AFTER, DEFAULT_PAGING_BEFORE, DEFAULT_PAGING_LIMIT } from '../core/Constants'
import { randomUUID } from 'crypto'
import IController from './IController'
import OrderLineDtoBuilder from '../core/builder/order/OrderLineDtoBuilder'

@singleton()
export default class OrderController implements IController {
  constructor (
    @inject(OrderService) private readonly service: OrderService,
    @inject(OrderDtoBuilder) private readonly orderBuilder: OrderDtoBuilder,
    @inject(OrderLineDtoBuilder) private readonly orderLineBuilder: OrderLineDtoBuilder
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const {
        total,
        status,
        userId,
        userName,
        locationId,
        locationName,
        storeId,
        storeName,
        paymentId,
        paymentName,
        orderLines
      } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const newOrder = this.orderBuilder
        .setTotal(total)
        .setStatus(status)
        .setUserId(userId)
        .setUserName(userName)
        .setDeliveryLocationId(locationId)
        .setDeliveryLocationName(locationName)
        .setStoreId(storeId)
        .setStoreName(storeName)
        .setPaymentMethodId(paymentId)
        .setPaymentMethodName(paymentName)
        .setCreatedAt(at)
        .setUpdatedAt(at)
        .setPaginationKey(randomUUID())
        .build()
      const newOrderLine = this.orderLineBuilder
        .setOrderLines(orderLines)
        .build()
      this.service.create(newOrder, newOrderLine)
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
      const { status } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const updateOrder = this.orderBuilder
        .setStatus(status)
        .setUpdatedAt(at)
        .build()
      this.service.update(id, updateOrder)
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
      const order = await this.service.findById(id)
      if (order !== null) {
        res.status(StatusCodes.OK).json(order)
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
        const orders = await this.service.paging(limit, after, before)
        res.status(StatusCodes.OK).json(orders)
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
        const orders = await this.service.pagingByCriteria(criteria)
        res.status(StatusCodes.OK).json(orders)
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
