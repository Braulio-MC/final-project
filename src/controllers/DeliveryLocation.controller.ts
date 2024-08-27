import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { Timestamp } from 'firebase-admin/firestore'
import { singleton, inject } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'
import DeliveryLocationService from '../data/service/DeliveryLocation.service'
import DeliveryLocationDtoBuilder from '../core/builder/deliverylocation/DeliveryLocationDtoBuilder'
import moment from 'moment'
import FilterOperator from '../core/criteria/FilterOperator'
import Filter from '../core/criteria/Filter'
import FieldPath from '../core/criteria/FieldPath'
import Filters from '../core/criteria/Filters'
import Order from '../core/criteria/Order'
import Criteria from '../core/criteria/Criteria'
import ErrorResponse from '../core/ErrorResponse'
import { expressErrorFormatter } from '../core/Utils'
import { DEFAULT_PAGING_AFTER, DEFAULT_PAGING_BEFORE, DEFAULT_PAGING_LIMIT } from '../core/Constants'
import { randomUUID } from 'crypto'
import IController from './IController'

@singleton()
export default class DeliveryLocationController implements IController {
  constructor (
    @inject(DeliveryLocationService) private readonly service: DeliveryLocationService,
    @inject(DeliveryLocationDtoBuilder) private readonly builder: DeliveryLocationDtoBuilder
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const { name, description, storeId } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const newDeliveryLocation = this.builder
        .setName(name)
        .setDescription(description)
        .setStoreID(storeId)
        .setCreatedAt(at)
        .setUpdatedAt(at)
        .setPaginationKey(randomUUID())
        .build()
      this.service.create(newDeliveryLocation)
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
      const { id } = req.params
      const { name, description, storeId } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const updateDeliveryLocation = this.builder
        .setName(name)
        .setDescription(description)
        .setStoreID(storeId)
        .setUpdatedAt(at)
        .build()
      this.service.update(id, updateDeliveryLocation)
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
      const deliveryLocation = await this.service.findById(id)
      if (deliveryLocation !== null) {
        res.status(StatusCodes.OK).json(deliveryLocation)
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
        const locations = await this.service.paging(limit, after, before)
        res.status(StatusCodes.OK).json(locations)
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
        const deliveryLocation = await this.service.existsByCriteria(criteria)
        res.status(StatusCodes.OK).json(deliveryLocation)
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
        const locations = await this.service.pagingByCriteria(criteria)
        res.status(StatusCodes.OK).json(locations)
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
