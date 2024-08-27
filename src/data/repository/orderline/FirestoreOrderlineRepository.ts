import { inject, singleton } from 'tsyringe'
import Criteria from '../../../core/criteria/Criteria'
import { PagingResult } from '../../../types'
import { firestoreConfig } from '../../../core/Configuration'
import { CollectionGroup, CollectionReference, Firestore } from 'firebase-admin/firestore'
import FirestoreCriteriaConverter from '../../persistance/firestore/FirestoreCriteriaConverter'
import IOrderlineRepository from './IOrderlineRepository'
import OrderDto from '../../dto/OrderDto'
import OrderLineDto from '../../dto/OrderLineDto'

@singleton()
export default class FirestoreOrderlineRepository implements IOrderlineRepository {
  private readonly _collectionName = firestoreConfig.order as string
  private readonly _subCollectionName = firestoreConfig.orderLines as string
  private readonly _collectionRef: CollectionReference<OrderDto>
  private readonly _subCollectionRef: CollectionGroup<OrderLineDto>
  private readonly _paginationKey = firestoreConfig.paginationKey as string

  constructor (
    @inject('FirestoreDB') private readonly firestoreDB: Firestore,
    @inject(FirestoreCriteriaConverter) private readonly converter: FirestoreCriteriaConverter
  ) {
    this._collectionRef = this.firestoreDB.collection(this._collectionName) as CollectionReference<OrderDto>
    this._subCollectionRef = this.firestoreDB.collectionGroup(this._subCollectionName) as CollectionGroup<OrderLineDto>
  }

  async create (item: OrderLineDto, id?: string): Promise<string> {
    if (typeof id === 'string') {
      const documentRef = await this._collectionRef.doc(id).collection(this._subCollectionName).add(item)
      return documentRef.id
    }
    return ''
  }

  async createAsBatch (orderId: string, items: OrderLineDto[]): Promise<void> {
    const batch = this.firestoreDB.batch()
    items.forEach(item => {
      const documentRef = this._collectionRef.doc(orderId).collection(this._subCollectionName).doc()
      batch.set(documentRef, item)
    })
    await batch.commit()
  }

  async update (id: string, item: Partial<OrderLineDto>, nestedId?: string): Promise<void> {
    if (typeof nestedId === 'string') {
      await this._collectionRef.doc(id).collection(this._subCollectionName).doc(nestedId).update(item)
    }
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<OrderLineDto>> {
    let ref = this._subCollectionRef.orderBy(this._paginationKey)
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    const all: OrderLineDto[] = []
    if (!querySnapshot.empty) {
      for (const doc of querySnapshot.docs) {
        const message: OrderLineDto = {
          id: doc.id,
          total: doc.data()?.total,
          quantity: doc.data()?.quantity,
          product: {
            id: doc.data()?.product?.id,
            name: doc.data()?.product?.name,
            image: doc.data()?.product?.image,
            price: doc.data()?.product?.price
          },
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
          paginationKey: doc.data()?.paginationKey
        }
        all.push(message)
      }
    }
    const pagingResult: PagingResult<OrderLineDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }

  async findById (id: string, nestedId?: string): Promise<OrderLineDto | null> {
    if (typeof nestedId === 'string') {
      const documentRef = await this._collectionRef.doc(id).collection(this._subCollectionName).doc(nestedId).get()
      if (documentRef.exists) {
        const one: OrderLineDto = {
          id: documentRef.id,
          total: documentRef.data()?.total,
          quantity: documentRef.data()?.quantity,
          product: {
            id: documentRef.data()?.product.id,
            name: documentRef.data()?.product.name,
            image: documentRef.data()?.product.image,
            price: documentRef.data()?.product.price
          },
          createdAt: documentRef.data()?.createdAt,
          updatedAt: documentRef.data()?.updatedAt,
          paginationKey: documentRef.data()?.paginationKey
        }
        return one
      }
    }
    return null
  }

  //* Cant be removed because it belongs to a order and orders cant be removed (restrict in routes)
  async delete (id: string, nestedId?: string): Promise<void> {
    if (typeof nestedId === 'string') {
      await this._collectionRef.doc(id).collection(this._subCollectionName).doc(nestedId).delete()
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

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<OrderLineDto>> {
    const convertResult = this.converter.convert(criteria)
    const limit = convertResult.limit
    const after = convertResult.after
    const before = convertResult.before
    let ref = this._subCollectionRef.orderBy(this._paginationKey)
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
    const all: OrderLineDto[] = []
    if (!querySnapshot.empty) {
      for (const doc of querySnapshot.docs) {
        const line: OrderLineDto = {
          id: doc.id,
          total: doc.data()?.total,
          quantity: doc.data()?.quantity,
          product: {
            id: doc.data()?.product?.id,
            name: doc.data()?.product?.name,
            image: doc.data()?.product?.image,
            price: doc.data()?.product?.price
          },
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
          paginationKey: doc.data()?.paginationKey
        }
        all.push(line)
      }
    }
    const pagingResult: PagingResult<OrderLineDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }
}
