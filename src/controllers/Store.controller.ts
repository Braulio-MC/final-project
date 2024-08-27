import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { Timestamp } from 'firebase-admin/firestore'
import { inject, singleton } from 'tsyringe'
import StoreService from '../data/service/Store.service'
import StoreDtoBuilder from '../core/builder/store/StoreDtoBuilder'
import moment from 'moment'
import { NextFunction, Request, Response } from 'express'
import Filters from '../core/criteria/Filters'
import Filter from '../core/criteria/Filter'
import FieldPath from '../core/criteria/FieldPath'
import FilterOperator from '../core/criteria/FilterOperator'
import Order from '../core/criteria/Order'
import Criteria from '../core/criteria/Criteria'
import { expressErrorFormatter } from '../core/Utils'
import ErrorResponse from '../core/ErrorResponse'
import {
  DEFAULT_PAGING_AFTER,
  DEFAULT_PAGING_BEFORE,
  DEFAULT_PAGING_LIMIT,
  FIREBASE_STORAGE_IMAGES_DIR,
  MULTER_TEMP_DIR
} from '../core/Constants'
import { randomUUID } from 'crypto'
import IController from './IController'
import StorageService from '../data/service/storage/Storage.service'
import FileSystemService from '../data/service/filesystem/filesystem.service'

@singleton()
export default class StoreController implements IController {
  constructor (
    @inject(StoreService) private readonly service: StoreService,
    @inject(StorageService) private readonly storageService: StorageService,
    @inject(FileSystemService) private readonly fileSystemService: FileSystemService,
    @inject(StoreDtoBuilder) private readonly builder: StoreDtoBuilder
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req).formatWith(expressErrorFormatter)
    if (errors.isEmpty()) {
      const { name, description, email, phoneNumber, userId } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      if (req.file == null) {
        const error = new ErrorResponse('Image is required', StatusCodes.BAD_REQUEST)
        next(error)
      } else {
        const fileName = req.file.filename
        const fileMimeType = req.file.mimetype
        const newStore = this.builder
          .setName(name)
          .setDescription(description)
          .setEmail(email)
          .setPhoneNumber(phoneNumber)
          .setUserId(userId)
          .setCreatedAt(at)
          .setUpdatedAt(at)
          .setPaginationKey(randomUUID())
          .build()
        this.service.create(newStore)
          .then(id => {
            const localPath = `${MULTER_TEMP_DIR}/${id}/${fileName}` // tmp/uploads/store id/filename
            const storagePath = `${FIREBASE_STORAGE_IMAGES_DIR}/${id}/${fileName}` // images/store id/filename
            const mkDirPath = `${MULTER_TEMP_DIR}/${id}` // tmp/uploads/store id
            const sourcePath = `${MULTER_TEMP_DIR}/${fileName}` // tmp/uploads/filename
            const destinationPath = `${MULTER_TEMP_DIR}/${id}/${fileName}` // tmp/uploads/store id/filename
            this.fileSystemService.mkDir(mkDirPath, { recursive: true })
              .then(_ => {
                this.fileSystemService.move(sourcePath, destinationPath)
                  .then(_ => {
                    this.storageService.saveImage(localPath, storagePath, fileMimeType)
                      .then(url => {
                        const updateStore = this.builder
                          .setImage(url)
                          .build()
                        this.service.update(id, updateStore)
                          .then(_ => {
                            res.status(StatusCodes.CREATED).json(id)
                          })
                          .catch(e => {
                            const error = new ErrorResponse(e.message, StatusCodes.UNPROCESSABLE_ENTITY)
                            next(error)
                          })
                      }).catch(e => {
                        const error = new ErrorResponse(e.message, StatusCodes.INTERNAL_SERVER_ERROR)
                        next(error)
                      })
                  })
                  .catch(e => {
                    const error = new ErrorResponse(e.message, StatusCodes.INTERNAL_SERVER_ERROR)
                    next(error)
                  })
              })
              .catch(e => {
                const error = new ErrorResponse(e.message, StatusCodes.INTERNAL_SERVER_ERROR)
                next(error)
              })
          })
          .catch(e => {
            console.log(e)
            const error = new ErrorResponse(e.message, StatusCodes.UNPROCESSABLE_ENTITY)
            next(error)
          })
      }
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
      const { name, description, email, phoneNumber, userId } = req.body
      const at = Timestamp.fromDate(moment().toDate())
      if (req.file != null) {
        const localPath = `${MULTER_TEMP_DIR}/${id}/${req.file.filename}` // tmp/uploads/store id/filename
        const storagePath = `${FIREBASE_STORAGE_IMAGES_DIR}/${id}/${req.file.filename}` // images/store id/filename
        const mkDirPath = `${MULTER_TEMP_DIR}/${id}` // tmp/uploads/store id
        const sourcePath = `${MULTER_TEMP_DIR}/${req.file.filename}` // tmp/uploads/filename
        const destinationPath = `${MULTER_TEMP_DIR}/${id}/${req.file.filename}` // tmp/uploads/store id/filename
        const fileMimeType = req.file.mimetype
        this.fileSystemService.mkDir(mkDirPath, { recursive: true })
          .then(_ => {
            this.fileSystemService.move(sourcePath, destinationPath)
              .then(_ => {
                this.storageService.updateImage(localPath, storagePath, fileMimeType, id)
                  .then(url => {
                    const updateStore = this.builder
                      .setName(name)
                      .setDescription(description)
                      .setEmail(email)
                      .setImage(url)
                      .setPhoneNumber(phoneNumber)
                      .setUserId(userId)
                      .setUpdatedAt(at)
                      .build()
                    this.service.update(id, updateStore)
                      .then(_ => {
                        res.sendStatus(StatusCodes.OK)
                      })
                      .catch(e => {
                        const error = new ErrorResponse(e.message, StatusCodes.UNPROCESSABLE_ENTITY)
                        next(error)
                      })
                  }).catch(e => {
                    const error = new ErrorResponse(e.message, StatusCodes.INTERNAL_SERVER_ERROR)
                    next(error)
                  })
              })
              .catch(e => {
                const error = new ErrorResponse(e.message, StatusCodes.INTERNAL_SERVER_ERROR)
                next(error)
              })
          })
          .catch(e => {
            const error = new ErrorResponse(e.message, StatusCodes.INTERNAL_SERVER_ERROR)
            next(error)
          })
      } else {
        const updateStore = this.builder
          .setName(name)
          .setDescription(description)
          .setEmail(email)
          .setPhoneNumber(phoneNumber)
          .setUserId(userId)
          .setUpdatedAt(at)
          .build()
        this.service.update(id, updateStore)
          .then(_ => {
            res.sendStatus(StatusCodes.OK)
          })
          .catch(e => {
            const error = new ErrorResponse(e.message, StatusCodes.UNPROCESSABLE_ENTITY)
            next(error)
          })
      }
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
      const store = await this.service.findById(id)
      if (store !== null) {
        res.status(StatusCodes.OK).json(store)
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
        const stores = await this.service.paging(limit, after, before)
        res.status(StatusCodes.OK).json(stores)
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
        const store = await this.service.existsByCriteria(criteria)
        res.status(StatusCodes.OK).json(store)
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
        const stores = await this.service.pagingByCriteria(criteria)
        res.status(StatusCodes.OK).json(stores)
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
