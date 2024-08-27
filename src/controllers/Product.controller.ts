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
  DEFAULT_PAGING_LIMIT
} from '../core/Constants'
import { randomUUID } from 'crypto'
import IController from './IController'
import StorageService from '../data/service/storage/Storage.service'

@singleton()
export default class ProductController implements IController {
  constructor (
    @inject(ProductService) private readonly service: ProductService,
    @inject(StorageService) private readonly storageService: StorageService,
    @inject(ProductDtoBuilder) private readonly builder: ProductDtoBuilder
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const {
        name,
        description,
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
      let imageUrl = ''
      if (req.file == null) {
        const error = new ErrorResponse('Image is required', StatusCodes.BAD_REQUEST)
        next(error)
      } else {
        const localPath = `${storeName as string}/${req.file.filename}` // tmp/uploads/storeName/fileName
        const storagePath = `${storeName as string}/${req.file.filename}` // images/storeName/fileName
        this.storageService.saveImage(localPath, storagePath, req.file.mimetype)
          .then(url => {
            imageUrl = url
          }).catch(e => {
            const error = new ErrorResponse(e.message, StatusCodes.INTERNAL_SERVER_ERROR)
            next(error)
          })
      }
      const newProduct = this.builder
        .setName(name)
        .setDescription(description)
        .setImage(imageUrl)
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
      const {
        name,
        description,
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
      let updateProduct = this.builder
        .setName(name)
        .setDescription(description)
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
      if (req.file != null) {
        const localPath = `${storeName as string}/${req.file.filename}` // tmp/uploads/storeName/fileName
        this.storageService.updateImage(localPath, req.file.filename, req.file.mimetype, id)
          .then(url => {
            updateProduct = this.builder
              .setName(name)
              .setDescription(description)
              .setImage(url)
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
          }).catch(e => {
            const error = new ErrorResponse(e.message, StatusCodes.INTERNAL_SERVER_ERROR)
            next(error)
          })
      }
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
        const product = await this.service.existsByCriteria(criteria)
        res.status(StatusCodes.OK).json(product)
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
}
