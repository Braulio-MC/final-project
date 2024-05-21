import { inject, singleton } from 'tsyringe'
import DiscountDto from '../../dto/DiscountDto'
import IDiscountRepository from './IDiscountRepository'
import { CollectionReference, FieldPath, Firestore, Timestamp } from 'firebase-admin/firestore'
import FirestoreCriteriaConverter from '../../persistance/firestore/FirestoreCriteriaConverter'
import Criteria from '../../../core/criteria/Criteria'
import { PagingResult } from '../../../types'
import moment from 'moment'
import { firestoreConfig } from '../../../core/Configuration'

@singleton()
export default class FirestoreDiscountRepository implements IDiscountRepository {
  private readonly _collectionName = firestoreConfig.discount as string
  private readonly _productCollectionName = firestoreConfig.product as string
  private readonly _collectionRef: CollectionReference<DiscountDto>
  private readonly _paginationKey = firestoreConfig.paginationKey as string

  constructor (
    @inject('FirestoreDB') private readonly firestoreDB: Firestore,
    @inject(FirestoreCriteriaConverter) private readonly converter: FirestoreCriteriaConverter
  ) {
    this._collectionRef = this.firestoreDB.collection(this._collectionName) as CollectionReference<DiscountDto>
  }

  async create (item: DiscountDto): Promise<void> {
    await this._collectionRef.add(item)
  }

  async update (id: string, item: Partial<DiscountDto>): Promise<void> {
    const batch = this.firestoreDB.batch()
    const discountRef = this._collectionRef.doc(id)
    batch.update(discountRef, item)
    // ? update discount from related products
    const updateProductsDiscount = {
      'discount.percentage': item.percentage,
      'discount.startDate': item.startDate,
      'discount.endDate': item.endDate,
      updatedAt: Timestamp.fromDate(moment().toDate())
    }
    const productsQuerySnapshot = await this.firestoreDB.collection(this._productCollectionName)
      .where(new FieldPath('discount', 'id'), '==', id)
      .get()
    if (!productsQuerySnapshot.empty) {
      productsQuerySnapshot.forEach(product => {
        batch.update(product.ref, updateProductsDiscount)
      })
    }
    await batch.commit()
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<DiscountDto>> {
    let ref = this._collectionRef.orderBy(this._paginationKey)
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    let all: DiscountDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        percentage: doc.data()?.percentage,
        startDate: doc.data()?.startDate,
        endDate: doc.data()?.endDate,
        storeId: doc.data()?.storeId,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<DiscountDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }

  async findById (id: string): Promise<DiscountDto | null> {
    const documentRef = await this._collectionRef.doc(id).get()
    if (documentRef.exists) {
      const one: DiscountDto = {
        id: documentRef.id,
        percentage: documentRef.data()?.percentage,
        startDate: documentRef.data()?.startDate,
        endDate: documentRef.data()?.endDate,
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
    // ? if there are products related to the discount, set discount fields to default
    const batch = this.firestoreDB.batch()
    const discountRef = this._collectionRef.doc(id)
    batch.delete(discountRef)
    const updateProductsDiscount = {
      'discount.percentage': 0,
      'discount.startDate': Timestamp.fromDate(new Date(1970, 0)),
      'discount.endDate': Timestamp.fromDate(new Date(1970, 0)),
      updatedAt: Timestamp.fromDate(moment().toDate())
    }
    const productsQuerySnapshot = await this.firestoreDB.collection(this._productCollectionName)
      .where(new FieldPath('discount', 'id'), '==', id)
      .get()
    if (!productsQuerySnapshot.empty) {
      productsQuerySnapshot.forEach(product => {
        batch.update(product.ref, updateProductsDiscount)
      })
    }
    await batch.commit()
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<DiscountDto>> {
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
    let all: DiscountDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        percentage: doc.data()?.percentage,
        startDate: doc.data()?.startDate,
        endDate: doc.data()?.endDate,
        storeId: doc.data()?.storeId,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<DiscountDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }
}
