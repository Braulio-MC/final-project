import { inject, singleton } from 'tsyringe'
import DeliveryLocationDto from '../../dto/DeliveryLocationDto'
import IDeliveryLocationRepository from './IDeliveryLocationRepository'
import { CollectionReference, FieldPath, Firestore } from 'firebase-admin/firestore'
import Criteria from '../../../core/criteria/Criteria'
import FirestoreCriteriaConverter from '../../persistance/firestore/FirestoreCriteriaConverter'
import { PagingResult } from '../../../types'
import { firestoreConfig } from '../../../core/Configuration'
import OrderStatuses from '../../../core/OrderStatuses'
import ErrorResponse from '../../../core/ErrorResponse'
import { StatusCodes } from 'http-status-codes'
import { DELIVERY_LOCATION_DELETE_ERROR_MESSAGE, DELIVERY_LOCATION_UPDATE_ERROR_MESSAGE } from '../../../core/Constants'

@singleton()
export default class FirestoreDeliveryLocationRepository implements IDeliveryLocationRepository {
  private readonly _collectionName = firestoreConfig.deliveryLocation as string
  private readonly _orderCollectionName = firestoreConfig.order as string
  private readonly _collectionRef: CollectionReference<DeliveryLocationDto>
  private readonly _paginationKey = firestoreConfig.paginationKey as string

  constructor (
    @inject('FirestoreDB') private readonly firestoreDB: Firestore,
    @inject(FirestoreCriteriaConverter) private readonly converter: FirestoreCriteriaConverter
  ) {
    this._collectionRef = this.firestoreDB.collection(this._collectionName) as CollectionReference<DeliveryLocationDto>
  }

  async create (item: DeliveryLocationDto): Promise<string> {
    const documentRef = await this._collectionRef.add(item)
    return documentRef.id
  }

  async update (id: string, item: Partial<DeliveryLocationDto>): Promise<void> {
    // ? if at least one active order is associated with the delivery location restrict updation
    const ordersQuerySnapshot = await this.firestoreDB.collection(this._orderCollectionName)
      .where(new FieldPath('deliveryLocation', 'id'), '==', id)
      .where('status', 'not-in', [OrderStatuses.DELIVERED, OrderStatuses.CANCELLED])
      .limit(1)
      .get()
    if (ordersQuerySnapshot.empty) {
      await this._collectionRef.doc(id).update(item)
    } else {
      throw new ErrorResponse(
        DELIVERY_LOCATION_UPDATE_ERROR_MESSAGE,
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    }
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<DeliveryLocationDto>> {
    let ref = this._collectionRef.orderBy(this._paginationKey)
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    let all: DeliveryLocationDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data()?.name,
        description: doc.data()?.description,
        storeId: doc.data()?.storeId,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<DeliveryLocationDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }

  async findById (id: string): Promise<DeliveryLocationDto | null> {
    const documentRef = await this._collectionRef.doc(id).get()
    if (documentRef.exists) {
      const one: DeliveryLocationDto = {
        id: documentRef.id,
        name: documentRef.data()?.name,
        description: documentRef.data()?.description,
        storeId: documentRef.data()?.storeId,
        createdAt: documentRef.data()?.createdAt,
        updatedAt: documentRef.data()?.updatedAt,
        paginationKey: documentRef.data()?.paginationKey
      }
      return one
    }
    return null
  }

  async delete (id: string): Promise<void> {
    // ? if at least one active order is associated with the delivery location id restrict deletion
    const ordersQuerySnapshot = await this.firestoreDB.collection(this._orderCollectionName)
      .where(new FieldPath('delivery-location', 'id'), '==', id)
      .where('status', 'not-in', [OrderStatuses.DELIVERED, OrderStatuses.CANCELLED])
      .limit(1)
      .get()
    if (ordersQuerySnapshot.empty) {
      await this._collectionRef.doc(id).delete()
    } else {
      throw new ErrorResponse(
        DELIVERY_LOCATION_DELETE_ERROR_MESSAGE,
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    }
  }

  async existsByCriteria (criteria: Criteria): Promise<boolean> {
    const convertResult = this.converter.convert(criteria)
    let ref = this._collectionRef.orderBy(this._paginationKey)
    convertResult.filters.forEach(filter => {
      ref = ref.where(filter.field, filter.operator, filter.value)
    })
    const limit = convertResult.limit
    if (convertResult.sort.field !== '') {
      ref = ref.orderBy(convertResult.sort.field, convertResult.sort.direction)
    }
    const querySnapshot = await ref.select('createdAt').limit(limit).get()
    return !querySnapshot.empty
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<DeliveryLocationDto>> {
    const convertResult = this.converter.convert(criteria)
    const limit = convertResult.limit
    const after = convertResult.after
    const before = convertResult.before
    let ref = this._collectionRef.orderBy(this._paginationKey)
    convertResult.filters.forEach(filter => {
      ref = ref.where(filter.field, filter.operator, filter.value)
    })
    if (convertResult.sort.field !== '') {
      ref = ref.orderBy(convertResult.sort.field, convertResult.sort.direction)
    }
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    let all: DeliveryLocationDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data()?.name,
        description: doc.data()?.description,
        storeId: doc.data()?.storeId,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<DeliveryLocationDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }
}
