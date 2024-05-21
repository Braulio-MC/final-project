import { inject, singleton } from 'tsyringe'
import { CollectionReference, FieldPath, Firestore, Timestamp } from 'firebase-admin/firestore'
import IStoreRepository from './IStoreRepository'
import StoreDto from '../../dto/StoreDto'
import FirestoreCriteriaConverter from '../../persistance/firestore/FirestoreCriteriaConverter'
import Criteria from '../../../core/criteria/Criteria'
import { PagingResult, StoreSearchResult } from '../../../types'
import { SearchIndex } from 'algoliasearch'
import { firestoreConfig } from '../../../core/Configuration'
import OrderStatuses from '../../../core/OrderStatuses'
import ErrorResponse from '../../../core/ErrorResponse'
import { StatusCodes } from 'http-status-codes'
import { STORE_DELETE_ERROR_MESSAGE, STORE_UPDATE_ERROR_MESSAGE } from '../../../core/Constants'
import moment from 'moment'

@singleton()
export default class FirestoreStoreRepository implements IStoreRepository {
  private readonly _collectionName = firestoreConfig.store as string
  private readonly _storeReviewcollectionName = firestoreConfig.storeReview as string
  private readonly _shoppingCartCollectionName = firestoreConfig.shoppingCart as string
  private readonly _storeFavoriteCollectionName = firestoreConfig.storeFavorite as string
  private readonly _categoryCollectionName = firestoreConfig.category as string
  private readonly _deliveryLocationCollectionName = firestoreConfig.deliveryLocation as string
  private readonly _discountCollectionName = firestoreConfig.discount as string
  private readonly _productCollectionName = firestoreConfig.product as string
  private readonly _orderCollectionName = firestoreConfig.order as string
  private readonly _collectionRef: CollectionReference<StoreDto>
  private readonly _paginationKey = firestoreConfig.paginationKey as string

  constructor (
    @inject('FirestoreDB') private readonly firestoreDB: Firestore,
    @inject(FirestoreCriteriaConverter) private readonly converter: FirestoreCriteriaConverter,
    @inject('StoreAlgoliaIndex') private readonly algoliaIndex: SearchIndex
  ) {
    this._collectionRef = this.firestoreDB.collection(this._collectionName) as CollectionReference<StoreDto>
  }

  async create (item: StoreDto): Promise<void> {
    await this._collectionRef.add(item)
  }

  async update (id: string, item: Partial<StoreDto>): Promise<void> {
    const ordersQuerySnapshot = await this.firestoreDB.collection(this._orderCollectionName)
      .where(new FieldPath('store', 'id'), '==', id)
      .where('status', 'not-in', [OrderStatuses.DELIVERED, OrderStatuses.CANCELLED])
      .limit(1)
      .get()
    if (ordersQuerySnapshot.empty) {
      const batch = this.firestoreDB.batch()
      const storeRef = this._collectionRef.doc(id)
      batch.update(storeRef, item)
      //* Products update
      const updateProducts = {
        'store.name': item.name,
        updatedAt: Timestamp.fromDate(moment().toDate())
      }
      const productsQuerySnapshot = await this.firestoreDB.collection(this._productCollectionName)
        .where(new FieldPath('store', 'id'), '==', id)
        .get()
      if (!productsQuerySnapshot.empty) {
        productsQuerySnapshot.forEach(product => {
          batch.update(product.ref, updateProducts)
        })
      }
      //* Shopping carts update
      const updateShoppingCarts = {
        'store.name': item.name,
        updatedAt: Timestamp.fromDate(moment().toDate())
      }
      const shoppingCartsQuerySnapshot = await this.firestoreDB.collection(this._shoppingCartCollectionName)
        .where(new FieldPath('store', 'id'), '==', id)
        .get()
      if (!shoppingCartsQuerySnapshot.empty) {
        shoppingCartsQuerySnapshot.forEach(shoppingCart => {
          batch.update(shoppingCart.ref, updateShoppingCarts)
        })
      }
      //* Store favorites update
      const updateStoreFavorites = {
        name: item.name,
        image: item.image,
        description: item.description,
        email: item.email,
        phoneNumber: item.phoneNumber
      }
      const storeFavoritesQuerySnapshot = await this.firestoreDB.collection(this._storeFavoriteCollectionName)
        .where('storeId', '==', id)
        .get()
      if (!storeFavoritesQuerySnapshot.empty) {
        storeFavoritesQuerySnapshot.forEach(storeFavorite => {
          batch.update(storeFavorite.ref, updateStoreFavorites)
        })
      }
      await batch.commit()
    } else {
      throw new ErrorResponse(
        STORE_UPDATE_ERROR_MESSAGE,
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    }
  }

  async search (query: string, perPage: number): Promise<StoreSearchResult[]> {
    const result = await this.algoliaIndex.search(query, {
      hitsPerPage: perPage
    })
    const hits = result.hits.map(hit => {
      const store: StoreSearchResult = {
        id: hit.objectID,
        name: 'name' in hit ? hit.name as string : '',
        phoneNumber: 'phoneNumber' in hit ? hit.phoneNumber as string : '',
        email: 'email' in hit ? hit.email as string : ''
      }
      return store
    })
    return hits
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<StoreDto>> {
    let ref = this._collectionRef.orderBy(this._paginationKey)
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    let all: StoreDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data()?.name,
        description: doc.data()?.description,
        email: doc.data()?.email,
        image: doc.data()?.image,
        phoneNumber: doc.data()?.phoneNumber,
        userId: doc.data()?.userId,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<StoreDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }

  async findById (id: string): Promise<StoreDto | null> {
    const documentRef = await this._collectionRef.doc(id).get()
    if (documentRef.exists) {
      const one: StoreDto = {
        id: documentRef.id,
        name: documentRef.data()?.name,
        description: documentRef.data()?.description,
        email: documentRef.data()?.email,
        image: documentRef.data()?.image,
        phoneNumber: documentRef.data()?.phoneNumber,
        userId: documentRef.data()?.userId,
        createdAt: documentRef.data()?.createdAt,
        updatedAt: documentRef.data()?.updatedAt,
        paginationKey: documentRef.data()?.paginationKey
      }
      return one
    }
    return null
  }

  async delete (id: string): Promise<void> {
    const ordersQuerySnapshot = await this.firestoreDB.collection(this._orderCollectionName)
      .where(new FieldPath('store', 'id'), '==', id)
      .where('status', 'not-in', [OrderStatuses.DELIVERED, OrderStatuses.CANCELLED])
      .limit(1)
      .get()
    if (ordersQuerySnapshot.empty) {
      const batch = this.firestoreDB.batch()
      const storeRef = this._collectionRef.doc(id)
      batch.delete(storeRef)
      //* Store reviews delete
      const storeReviewsQuerySnapshot = await this.firestoreDB.collection(this._storeReviewcollectionName)
        .where('storeId', '==', id)
        .get()
      if (!storeReviewsQuerySnapshot.empty) {
        storeReviewsQuerySnapshot.forEach(storeReview => {
          batch.delete(storeReview.ref)
        })
      }
      //* Shopping carts delete (manage subcollection delete)
      const shoppingCartsQuerySnapshot = await this.firestoreDB.collection(this._shoppingCartCollectionName)
        .where(new FieldPath('store', 'id'), '==', id)
        .get()
      if (!shoppingCartsQuerySnapshot.empty) {
        for (const shoppingCart of shoppingCartsQuerySnapshot.docs) {
          await this.firestoreDB.recursiveDelete(shoppingCart.ref) //* Managing subcollection delete
        }
      }
      //* Store favorites delete
      const storeFavoritesQuerySnapshot = await this.firestoreDB.collection(this._storeFavoriteCollectionName)
        .where('storeId', '==', id)
        .get()
      if (!storeFavoritesQuerySnapshot.empty) {
        storeFavoritesQuerySnapshot.forEach(storeFavorite => {
          batch.delete(storeFavorite.ref)
        })
      }
      //* Categories delete
      const categoriesQuerySnapshot = await this.firestoreDB.collection(this._categoryCollectionName)
        .where('storeId', '==', id)
        .get()
      if (!categoriesQuerySnapshot.empty) {
        categoriesQuerySnapshot.forEach(category => {
          batch.delete(category.ref)
        })
      }
      //* Delivery locations delete
      const deliveryLocationsQuerySnapshot = await this.firestoreDB.collection(this._deliveryLocationCollectionName)
        .where('storeId', '==', id)
        .get()
      if (!deliveryLocationsQuerySnapshot.empty) {
        deliveryLocationsQuerySnapshot.forEach(deliveryLocation => {
          batch.delete(deliveryLocation.ref)
        })
      }
      //* Discounts delete
      const discountsQuerySnapshot = await this.firestoreDB.collection(this._discountCollectionName)
        .where('storeId', '==', id)
        .get()
      if (!discountsQuerySnapshot.empty) {
        discountsQuerySnapshot.forEach(discount => {
          batch.delete(discount.ref)
        })
      }
      //* Products delete
      const productsQuerySnapshot = await this.firestoreDB.collection(this._productCollectionName)
        .where(new FieldPath('store', 'id'), '==', id)
        .get()
      if (!productsQuerySnapshot.empty) {
        productsQuerySnapshot.forEach(product => {
          batch.delete(product.ref)
        })
      }
      //* Orders delete (manage subcollection delete)
      const ordersQuerySnapshot = await this.firestoreDB.collection(this._orderCollectionName)
        .where(new FieldPath('store', 'id'), '==', id)
        .get()
      if (!ordersQuerySnapshot.empty) {
        for (const order of ordersQuerySnapshot.docs) {
          await this.firestoreDB.recursiveDelete(order.ref) //* Managing subcollection delete
        }
      }
      await batch.commit()
    } else {
      throw new ErrorResponse(
        STORE_DELETE_ERROR_MESSAGE,
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    }
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<StoreDto>> {
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
    let all: StoreDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data()?.name,
        description: doc.data()?.description,
        email: doc.data()?.email,
        image: doc.data()?.image,
        phoneNumber: doc.data()?.phoneNumber,
        userId: doc.data()?.userId,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<StoreDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }
}
