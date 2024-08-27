import { inject, singleton } from 'tsyringe'
import CategoryDto from '../../dto/CategoryDto'
import { CollectionReference, FieldPath, Firestore, Timestamp } from 'firebase-admin/firestore'
import ICategoryRepository from './ICategoryRepository'
import Criteria from '../../../core/criteria/Criteria'
import FirestoreCriteriaConverter from '../../persistance/firestore/FirestoreCriteriaConverter'
import moment from 'moment'
import { PagingResult } from '../../../types'
import { firestoreConfig } from '../../../core/Configuration'
import ErrorResponse from '../../../core/ErrorResponse'
import { StatusCodes } from 'http-status-codes'
import { CATEGORY_DELETE_ERROR_MESSAGE } from '../../../core/Constants'

@singleton()
export default class FirestoreCategoryRepository implements ICategoryRepository {
  private readonly _collectionName = firestoreConfig.category as string
  private readonly _productCollectionName = firestoreConfig.product as string
  private readonly _collectionRef: CollectionReference<CategoryDto>
  private readonly _paginationKey = firestoreConfig.paginationKey as string

  constructor (
    @inject('FirestoreDB') private readonly firestoreDB: Firestore,
    @inject(FirestoreCriteriaConverter) private readonly converter: FirestoreCriteriaConverter
  ) {
    this._collectionRef = this.firestoreDB.collection(this._collectionName) as CollectionReference<CategoryDto>
  }

  async create (item: CategoryDto): Promise<string> {
    const documentRef = await this._collectionRef.add(item)
    return documentRef.id
  }

  async update (id: string, item: Partial<CategoryDto>): Promise<void> {
    const batch = this.firestoreDB.batch()
    const categoryRef = this._collectionRef.doc(id)
    batch.update(categoryRef, item)
    // ? update category from related products
    const updateProductCategory = {
      'category.name': item.name,
      'category.parentName': item.parent?.name,
      updatedAt: Timestamp.fromDate(moment().toDate())
    }
    const productsQuerySnapshot = await this.firestoreDB.collection(this._productCollectionName)
      .where(new FieldPath('category', 'id'), '==', id)
      .get()
    if (!productsQuerySnapshot.empty) {
      productsQuerySnapshot.forEach(product => {
        batch.update(product.ref, updateProductCategory)
      })
    }
    await batch.commit()
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<CategoryDto>> {
    let ref = this._collectionRef.orderBy(this._paginationKey)
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    let all: CategoryDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data()?.name,
        parent: {
          id: doc.data()?.parent?.id,
          name: doc.data()?.parent?.name
        },
        storeId: doc.data()?.storeId,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<CategoryDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }

  async findById (id: string): Promise<CategoryDto | null> {
    const documentRef = await this._collectionRef.doc(id).get()
    if (documentRef.exists) {
      const one: CategoryDto = {
        id: documentRef.id,
        name: documentRef.data()?.name,
        parent: {
          id: documentRef.data()?.parent?.id,
          name: documentRef.data()?.parent?.name
        },
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
    // ? if at least one product is associated with the category id restrict deletion
    const productsQuerySnapshot = await this.firestoreDB.collection(this._productCollectionName)
      .where(new FieldPath('category', 'id'), '==', id)
      .limit(1)
      .get()
    if (productsQuerySnapshot.empty) {
      await this._collectionRef.doc(id).delete()
    } else {
      throw new ErrorResponse(
        CATEGORY_DELETE_ERROR_MESSAGE,
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

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<CategoryDto>> {
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
    let all: CategoryDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data()?.name,
        parent: {
          id: doc.data()?.parent?.id,
          name: doc.data()?.parent?.name
        },
        storeId: doc.data()?.storeId,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<CategoryDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }
}
