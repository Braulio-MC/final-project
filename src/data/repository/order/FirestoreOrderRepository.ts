import { inject, singleton } from 'tsyringe'
import OrderDto from '../../dto/OrderDto'
import IOrderRepository from './IOrderRepository'
import { CollectionReference, Firestore } from 'firebase-admin/firestore'
import FirestoreCriteriaConverter from '../../persistance/firestore/FirestoreCriteriaConverter'
import Criteria from '../../../core/criteria/Criteria'
import { OrderResult, PagingResult } from '../../../types'
import { firestoreConfig } from '../../../core/Configuration'
import OrderStatuses from '../../../core/OrderStatuses'
import ErrorResponse from '../../../core/ErrorResponse'
import { ORDER_DELETE_ERROR_MESSAGE } from '../../../core/Constants'
import { StatusCodes } from 'http-status-codes'
import UpdateOrderDto from '../../dto/UpdateOrderDto'

@singleton()
export default class FirestoreOrderRepository implements IOrderRepository {
  private readonly _collectionName = firestoreConfig.order as string
  private readonly _subCollectionName = firestoreConfig.orderLines as string
  private readonly _collectionRef: CollectionReference<OrderDto>
  private readonly _paginationKey = firestoreConfig.paginationKey as string

  constructor (
    @inject('FirestoreDB') private readonly firestoreDB: Firestore,
    @inject(FirestoreCriteriaConverter) private readonly converter: FirestoreCriteriaConverter
  ) {
    this._collectionRef = this.firestoreDB.collection(this._collectionName) as CollectionReference<OrderDto>
  }

  async create (item: OrderDto): Promise<string> {
    const documentRef = await this._collectionRef.add(item)
    return documentRef.id
  }

  async update (id: string, item: Partial<OrderDto>): Promise<void> {
    const update: UpdateOrderDto = {
      id: undefined,
      status: item.status,
      total: undefined,
      createdAt: undefined,
      updatedAt: item.updatedAt,
      store: undefined,
      user: undefined,
      deliveryLocation: undefined,
      paymentMethod: undefined,
      paginationKey: undefined
    }
    await this._collectionRef.doc(id).update({ ...update })
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<OrderResult>> {
    let ref = this._collectionRef.orderBy(this._paginationKey)
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    const all: OrderResult[] = []
    if (!querySnapshot.empty) {
      for (const doc of querySnapshot.docs) {
        const orderLinesQuerySnapshot = await this._collectionRef.doc(doc.id).collection(this._subCollectionName).get()
        const orderLines = orderLinesQuerySnapshot.docs.map(orderLine => ({
          id: orderLine.id,
          total: orderLine.data()?.total,
          quantity: orderLine.data()?.quantity,
          product: {
            id: orderLine.data()?.product.id,
            name: orderLine.data()?.product.name,
            image: orderLine.data()?.product.image,
            price: orderLine.data()?.product.price
          },
          createdAt: orderLine.data()?.createdAt,
          updatedAt: orderLine.data()?.updatedAt,
          paginationKey: orderLine.data()?.paginationKey
        }))
        const order: OrderResult = {
          id: doc.id,
          status: doc.data()?.status,
          total: doc.data()?.total,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
          store: {
            id: doc.data()?.store?.id,
            name: doc.data()?.store?.name
          },
          user: {
            id: doc.data()?.user?.id,
            name: doc.data()?.user?.name
          },
          deliveryLocation: {
            id: doc.data()?.deliveryLocation?.id,
            name: doc.data()?.deliveryLocation?.name
          },
          paymentMethod: {
            id: doc.data()?.paymentMethod?.id,
            name: doc.data()?.paymentMethod?.name
          },
          orderLines,
          paginationKey: doc.data()?.paginationKey
        }
        all.push(order)
      }
    }
    const pagingResult: PagingResult<OrderResult> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }

  async findById (id: string): Promise<OrderResult | null> {
    const documentRef = await this._collectionRef.doc(id).get()
    if (documentRef.exists) {
      const orderLinesQuerySnapshot = await this._collectionRef.doc(documentRef.id).collection(this._subCollectionName).get()
      const orderLines = orderLinesQuerySnapshot.docs.map(orderLine => ({
        id: orderLine.id,
        total: orderLine.data()?.total,
        quantity: orderLine.data()?.quantity,
        product: {
          id: orderLine.data()?.product.id,
          name: orderLine.data()?.product.name,
          image: orderLine.data()?.product.image,
          price: orderLine.data()?.product.price
        },
        createdAt: orderLine.data()?.createdAt,
        updatedAt: orderLine.data()?.updatedAt,
        paginationKey: orderLine.data()?.paginationKey
      }))
      const one: OrderResult = {
        id: documentRef.id,
        status: documentRef.data()?.status,
        total: documentRef.data()?.total,
        createdAt: documentRef.data()?.createdAt,
        updatedAt: documentRef.data()?.updatedAt,
        store: {
          id: documentRef.data()?.store?.id,
          name: documentRef.data()?.store?.name
        },
        user: {
          id: documentRef.data()?.user?.id,
          name: documentRef.data()?.user?.name
        },
        deliveryLocation: {
          id: documentRef.data()?.deliveryLocation?.id,
          name: documentRef.data()?.deliveryLocation?.name
        },
        paymentMethod: {
          id: documentRef.data()?.paymentMethod?.id,
          name: documentRef.data()?.paymentMethod?.name
        },
        orderLines,
        paginationKey: documentRef.data()?.paginationKey
      }
      return one
    }
    return null
  }

  //* Order cant be removed
  async delete (id: string): Promise<void> {
    const documentSnapshot = await this._collectionRef.doc(id).get()
    const status = documentSnapshot.data()?.status
    if (status !== undefined) {
      if (status in [OrderStatuses.DELIVERED, OrderStatuses.CANCELLED]) {
        await this.firestoreDB.recursiveDelete(documentSnapshot.ref)
      } else {
        throw new ErrorResponse(
          ORDER_DELETE_ERROR_MESSAGE,
          StatusCodes.UNPROCESSABLE_ENTITY
        )
      }
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

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<OrderResult>> {
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
    const all: OrderResult[] = []
    for (const doc of querySnapshot.docs) {
      const orderLinesQuerySnapshot = await this._collectionRef.doc(doc.id).collection(this._subCollectionName).get()
      const orderLines = orderLinesQuerySnapshot.docs.map(orderLine => ({
        id: orderLine.id,
        total: orderLine.data()?.total,
        quantity: orderLine.data()?.quantity,
        product: {
          id: orderLine.data()?.product.id,
          name: orderLine.data()?.product.name,
          image: orderLine.data()?.product.image,
          price: orderLine.data()?.product.price
        },
        createdAt: orderLine.data()?.createdAt,
        updatedAt: orderLine.data()?.updatedAt,
        paginationKey: orderLine.data()?.paginationKey
      }))
      const order: OrderResult = {
        id: doc.id,
        status: doc.data()?.status,
        total: doc.data()?.total,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        store: {
          id: doc.data()?.store?.id,
          name: doc.data()?.store?.name
        },
        user: {
          id: doc.data()?.user?.id,
          name: doc.data()?.user?.name
        },
        deliveryLocation: {
          id: doc.data()?.deliveryLocation?.id,
          name: doc.data()?.deliveryLocation?.name
        },
        paymentMethod: {
          id: doc.data()?.paymentMethod?.id,
          name: doc.data()?.paymentMethod?.name
        },
        orderLines,
        paginationKey: doc.data()?.paginationKey
      }
      all.push(order)
    }
    const pagingResult: PagingResult<OrderResult> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }
}
