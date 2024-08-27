import { inject, singleton } from 'tsyringe'
import Criteria from '../../../core/criteria/Criteria'
import { PagingResult } from '../../../types'
import { firestoreConfig } from '../../../core/Configuration'
import { CollectionGroup, CollectionReference, Firestore } from 'firebase-admin/firestore'
import FirestoreCriteriaConverter from '../../persistance/firestore/FirestoreCriteriaConverter'
import IShoppingCartItemRepository from './IShoppingCartItemRepository'
import ShoppingCartDto from '../../dto/ShoppingCartDto'
import ShoppingCartProductDto from '../../dto/ShoppingCartProductDto'

@singleton()
export default class FirestoreShoppingCartItemRepository implements IShoppingCartItemRepository {
  private readonly _collectionName = firestoreConfig.shoppingCart as string
  private readonly _subCollectionName = firestoreConfig.shoppingCartProducts as string
  private readonly _collectionRef: CollectionReference<ShoppingCartDto>
  private readonly _subCollectionRef: CollectionGroup<ShoppingCartProductDto>
  private readonly _paginationKey = firestoreConfig.paginationKey as string

  constructor (
    @inject('FirestoreDB') private readonly firestoreDB: Firestore,
    @inject(FirestoreCriteriaConverter) private readonly converter: FirestoreCriteriaConverter
  ) {
    this._collectionRef = this.firestoreDB.collection(this._collectionName) as CollectionReference<ShoppingCartDto>
    this._subCollectionRef = this.firestoreDB.collectionGroup(this._subCollectionName) as CollectionGroup<ShoppingCartProductDto>
  }

  async create (item: ShoppingCartProductDto, id?: string): Promise<string> {
    if (typeof id === 'string') {
      const documentRef = await this._collectionRef.doc(id).collection(this._subCollectionName).add(item)
      return documentRef.id
    }
    return ''
  }

  async createAsBatch (cartId: string, items: ShoppingCartProductDto[]): Promise<void> {
    const batch = this.firestoreDB.batch()
    items.forEach(item => {
      const documentRef = this._collectionRef.doc(cartId).collection(this._subCollectionName).doc()
      batch.set(documentRef, item)
    })
    await batch.commit()
  }

  async update (id: string, item: Partial<ShoppingCartProductDto>, nestedId?: string): Promise<void> {
    if (typeof nestedId === 'string') {
      await this._collectionRef.doc(id).collection(this._subCollectionName).doc(nestedId).update(item)
    }
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<ShoppingCartProductDto>> {
    let ref = this._subCollectionRef.orderBy(this._paginationKey)
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    const all: ShoppingCartProductDto[] = []
    if (!querySnapshot.empty) {
      for (const doc of querySnapshot.docs) {
        const message: ShoppingCartProductDto = {
          objectId: doc.id,
          id: doc.data()?.id,
          name: doc.data()?.name,
          image: doc.data()?.image,
          price: doc.data()?.price,
          quantity: doc.data()?.quantity,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
          paginationKey: doc.data()?.paginationKey
        }
        all.push(message)
      }
    }
    const pagingResult: PagingResult<ShoppingCartProductDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }

  async findById (id: string, nestedId?: string): Promise<ShoppingCartProductDto | null> {
    if (typeof nestedId === 'string') {
      const documentRef = await this._collectionRef.doc(id).collection(this._subCollectionName).doc(nestedId).get()
      if (documentRef.exists) {
        const one: ShoppingCartProductDto = {
          objectId: documentRef.id,
          id: documentRef.data()?.id,
          name: documentRef.data()?.name,
          image: documentRef.data()?.image,
          price: documentRef.data()?.price,
          quantity: documentRef.data()?.quantity,
          createdAt: documentRef.data()?.createdAt,
          updatedAt: documentRef.data()?.updatedAt,
          paginationKey: documentRef.data()?.paginationKey
        }
        return one
      }
    }
    return null
  }

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

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<ShoppingCartProductDto>> {
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
    const all: ShoppingCartProductDto[] = []
    if (!querySnapshot.empty) {
      for (const doc of querySnapshot.docs) {
        const item: ShoppingCartProductDto = {
          objectId: doc.id,
          id: doc.data()?.id,
          name: doc.data()?.name,
          image: doc.data()?.image,
          price: doc.data()?.price,
          quantity: doc.data()?.quantity,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
          paginationKey: doc.data()?.paginationKey
        }
        all.push(item)
      }
    }
    const pagingResult: PagingResult<ShoppingCartProductDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }
}
