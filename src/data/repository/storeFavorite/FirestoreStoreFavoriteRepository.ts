import { inject, singleton } from 'tsyringe'
import { CollectionReference, Firestore } from 'firebase-admin/firestore'
import FirestoreCriteriaConverter from '../../persistance/firestore/FirestoreCriteriaConverter'
import Criteria from '../../../core/criteria/Criteria'
import IStoreFavoriteRepository from './IStoreFavoriteRepository'
import StoreFavoriteDto from '../../dto/StoreFavoriteDto'
import { PagingResult } from '../../../types'
import { firestoreConfig } from '../../../core/Configuration'

@singleton()
export default class FirestoreStoreFavoriteRepository implements IStoreFavoriteRepository {
  private readonly _collectionName = firestoreConfig.storeFavorite as string
  private readonly _collectionRef: CollectionReference<StoreFavoriteDto>
  private readonly _paginationKey = firestoreConfig.paginationKey as string

  constructor (
    @inject('FirestoreDB') private readonly firestoreDB: Firestore,
    @inject(FirestoreCriteriaConverter) private readonly converter: FirestoreCriteriaConverter
  ) {
    this._collectionRef = this.firestoreDB.collection(this._collectionName) as CollectionReference<StoreFavoriteDto>
  }

  async create (item: StoreFavoriteDto): Promise<void> {
    await this._collectionRef.add(item)
  }

  async update (id: string, item: Partial<StoreFavoriteDto>): Promise<void> {
    await this._collectionRef.doc(id).update(item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<StoreFavoriteDto>> {
    let ref = this._collectionRef.orderBy(this._paginationKey)
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    let all: StoreFavoriteDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data()?.userId,
        storeId: doc.data()?.storeId,
        name: doc.data()?.name,
        description: doc.data()?.description,
        email: doc.data()?.email,
        image: doc.data()?.image,
        phoneNumber: doc.data()?.phoneNumber,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<StoreFavoriteDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }

  async findById (id: string): Promise<StoreFavoriteDto | null> {
    const documentRef = await this._collectionRef.doc(id).get()
    if (documentRef.exists) {
      const one: StoreFavoriteDto = {
        id: documentRef.id,
        userId: documentRef.data()?.userId,
        storeId: documentRef.data()?.storeId,
        name: documentRef.data()?.name,
        description: documentRef.data()?.description,
        email: documentRef.data()?.email,
        image: documentRef.data()?.image,
        phoneNumber: documentRef.data()?.phoneNumber,
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

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<StoreFavoriteDto>> {
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
    let all: StoreFavoriteDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data()?.userId,
        storeId: doc.data()?.storeId,
        name: doc.data()?.name,
        description: doc.data()?.description,
        email: doc.data()?.email,
        image: doc.data()?.image,
        phoneNumber: doc.data()?.phoneNumber,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<StoreFavoriteDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }
}
