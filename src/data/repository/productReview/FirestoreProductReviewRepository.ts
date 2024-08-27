import { inject, singleton } from 'tsyringe'
import { CollectionReference, Firestore } from 'firebase-admin/firestore'
import IProductReviewRepository from './IProductReviewRepository'
import ProductReviewDto from '../../dto/ProductReviewDto'
import FirestoreCriteriaConverter from '../../persistance/firestore/FirestoreCriteriaConverter'
import Criteria from '../../../core/criteria/Criteria'
import { PagingResult } from '../../../types'
import { firestoreConfig } from '../../../core/Configuration'

@singleton()
export default class FirestoreProductReviewRepository implements IProductReviewRepository {
  private readonly _collectionName = firestoreConfig.productReview as string
  private readonly _collectionRef: CollectionReference<ProductReviewDto>
  private readonly _paginationKey = firestoreConfig.paginationKey as string

  constructor (
    @inject('FirestoreDB') private readonly firestoreDB: Firestore,
    @inject(FirestoreCriteriaConverter) private readonly converter: FirestoreCriteriaConverter
  ) {
    this._collectionRef = this.firestoreDB.collection(this._collectionName) as CollectionReference<ProductReviewDto>
  }

  async create (item: ProductReviewDto): Promise<string> {
    const documentRef = await this._collectionRef.add(item)
    return documentRef.id
  }

  async update (id: string, item: Partial<ProductReviewDto>): Promise<void> {
    await this._collectionRef.doc(id).update(item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<ProductReviewDto>> {
    let ref = this._collectionRef.orderBy(this._paginationKey)
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    let all: ProductReviewDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data()?.userId,
        productId: doc.data()?.productId,
        rating: doc.data()?.rating,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<ProductReviewDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }

  async findById (id: string): Promise<ProductReviewDto | null> {
    const documentRef = await this._collectionRef.doc(id).get()
    if (documentRef.exists) {
      const one: ProductReviewDto = {
        id: documentRef.id,
        userId: documentRef.data()?.userId,
        productId: documentRef.data()?.productId,
        rating: documentRef.data()?.rating,
        createdAt: documentRef.data()?.createdAt,
        updatedAt: documentRef.data()?.updatedAt,
        paginationKey: documentRef.data()?.paginationKey
      }
      return one
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this._collectionRef.doc(id).delete()
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

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<ProductReviewDto>> {
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
    let all: ProductReviewDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data()?.userId,
        productId: doc.data()?.productId,
        rating: doc.data()?.rating,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<ProductReviewDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }
}
