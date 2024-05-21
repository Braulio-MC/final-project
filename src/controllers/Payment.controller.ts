// import Stripe from 'stripe'
import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { Timestamp } from 'firebase-admin/firestore'
import { inject, singleton } from 'tsyringe'
import PaymentService from '../data/service/Payment.service'
import PaymentDtoBuilder from '../core/builder/payment/PaymentDtoBuilder'
import { NextFunction, Request, Response } from 'express'
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

// export const checkout = async (req, res, next) => {
//   const errors = validationResult(req)
//   if (errors.isEmpty()) {
//     const { items } = req.body
//     const stripe = new Stripe('API KEY') // Get from configuration file
//     const lineItems = items.map(async item => {
//       const p = await product.findByPk(item.id)
//       return {
//         price_date: {
//           currency: 'mxn',
//           product_data: {
//             name: p.name
//           },
//           unit_amount: p.price
//         },
//         quantity: 0 // In cents
//       }
//     })
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       line_items: lineItems,
//       success_url: '',
//       cancel_url: ''
//     })
//   } else {
//     const error = new ApiError(errors.array(), StatusCodes.UNPROCESSABLE_ENTITY)
//     next(error)
//   }
// }

@singleton()
export default class PaymentController implements IController {
  constructor (
    @inject(PaymentService) private readonly service: PaymentService,
    @inject(PaymentDtoBuilder) private readonly builder: PaymentDtoBuilder
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const { name, description } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const newPaymentType = this.builder
        .setName(name)
        .setDescription(description)
        .setCreatedAt(at)
        .setUpdatedAt(at)
        .setPaginationKey(randomUUID())
        .build()
      this.service.create(newPaymentType)
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
      const { name, description } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      const updatePaymentType = this.builder
        .setName(name)
        .setDescription(description)
        .setUpdatedAt(at)
        .build()
      this.service.update(id, updatePaymentType)
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
      const paymentType = await this.service.findById(id)
      if (paymentType !== null) {
        res.status(StatusCodes.OK).json(paymentType)
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
        const payments = await this.service.paging(limit, after, before)
        res.status(StatusCodes.OK).json(payments)
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
        const payments = await this.service.pagingByCriteria(criteria)
        res.status(StatusCodes.OK).json(payments)
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
