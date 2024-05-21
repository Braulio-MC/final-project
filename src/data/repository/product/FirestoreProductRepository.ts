import { inject, singleton } from 'tsyringe'
import ProductDto from '../../dto/ProductDto'
import IProductRepository from './IProductRepository'
import { CollectionReference, FieldPath, Firestore, Timestamp } from 'firebase-admin/firestore'
import Criteria from '../../../core/criteria/Criteria'
import FirestoreCriteriaConverter from '../../persistance/firestore/FirestoreCriteriaConverter'
import { PagingResult, ProductSearchResult } from '../../../types'
import { SearchIndex } from 'algoliasearch'
import moment from 'moment'
import { firestoreConfig } from '../../../core/Configuration'
import OrderStatuses from '../../../core/OrderStatuses'
import ErrorResponse from '../../../core/ErrorResponse'
import { StatusCodes } from 'http-status-codes'
import { PRODUCT_DELETE_ERROR_MESSAGE } from '../../../core/Constants'

@singleton()
export default class FirestoreProductRepository implements IProductRepository {
  private readonly _collectionName = firestoreConfig.product as string
  private readonly _productFavoriteCollectionName = firestoreConfig.productFavorite as string
  private readonly _orderCollectionName = firestoreConfig.order as string
  private readonly _orderSubcollectionName = firestoreConfig.orderLines as string
  private readonly _productReviewCollectionName = firestoreConfig.productReview as string
  private readonly _shoppingCartSubcollectionName = firestoreConfig.shoppingCartProducts as string
  private readonly _collectionRef: CollectionReference<ProductDto>
  private readonly _paginationKey = firestoreConfig.paginationKey as string

  constructor (
    @inject('FirestoreDB') private readonly firestoreDB: Firestore,
    @inject(FirestoreCriteriaConverter) private readonly converter: FirestoreCriteriaConverter,
    @inject('ProductAlgoliaIndex') private readonly algoliaIndex: SearchIndex
  ) {
    this._collectionRef = this.firestoreDB.collection(this._collectionName) as CollectionReference<ProductDto>
  }

  async create (item: ProductDto): Promise<void> {
    await this._collectionRef.add(item)
  }

  async update (id: string, item: Partial<ProductDto>): Promise<void> {
    const batch = this.firestoreDB.batch()
    const productRef = this._collectionRef.doc(id)
    batch.update(productRef, item)
    //* product favorites update
    const updateProductFavorites = {
      name: item.name,
      image: item.image,
      description: item.description,
      updatedAt: Timestamp.fromDate(moment().toDate())
    }
    const productFavoritesQuerySnapshot = await this.firestoreDB.collection(this._productFavoriteCollectionName)
      .where('productId', '==', id)
      .get()
    if (!productFavoritesQuerySnapshot.empty) {
      productFavoritesQuerySnapshot.forEach(productFavorite => {
        batch.update(productFavorite.ref, updateProductFavorites)
      })
    }
    //* shopping carts update
    const updateShoppingCartProducts = {
      name: item.name,
      image: item.image,
      price: item.price
    }
    const shoppingCartsQuerySnapshot = await this.firestoreDB.collectionGroup(this._shoppingCartSubcollectionName)
      .where('id', '==', id)
      .get()
    if (!shoppingCartsQuerySnapshot.empty) {
      shoppingCartsQuerySnapshot.forEach(shoppingCartProduct => {
        batch.update(shoppingCartProduct.ref, updateShoppingCartProducts)
      })
    }
    await batch.commit()
  }

  async search (query: string, perPage: number): Promise<ProductSearchResult[]> {
    const result = await this.algoliaIndex.search(query, {
      hitsPerPage: perPage
    })
    const hits = result.hits.map(hit => {
      const product: ProductSearchResult = {
        id: hit.objectID,
        name: 'name' in hit ? hit.name as string : '',
        categoryName: 'category.name' in hit ? hit['category.name'] as string : '',
        storeName: 'store.name' in hit ? hit['store.name'] as string : ''
      }
      return product
    })
    return hits
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<ProductDto>> {
    let ref = this._collectionRef.orderBy(this._paginationKey)
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    let all: ProductDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data()?.name,
        description: doc.data()?.description,
        image: doc.data()?.image,
        price: doc.data()?.price,
        quantity: doc.data()?.quantity,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        store: {
          id: doc.data()?.store.id,
          name: doc.data()?.store.name
        },
        category: {
          id: doc.data()?.category.id,
          name: doc.data()?.category.name,
          parentName: doc.data()?.category.parentName
        },
        discount: {
          id: doc.data()?.discount.id,
          percentage: doc.data()?.discount.percentage,
          startDate: doc.data()?.discount.startDate,
          endDate: doc.data()?.discount.endDate
        },
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<ProductDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }

  async findById (id: string): Promise<ProductDto | null> {
    const documentRef = await this._collectionRef.doc(id).get()
    if (documentRef.exists) {
      const one: ProductDto = {
        id: documentRef.id,
        name: documentRef.data()?.name,
        description: documentRef.data()?.description,
        image: documentRef.data()?.image,
        price: documentRef.data()?.price,
        quantity: documentRef.data()?.quantity,
        createdAt: documentRef.data()?.createdAt,
        updatedAt: documentRef.data()?.updatedAt,
        store: {
          id: documentRef.data()?.store.id,
          name: documentRef.data()?.store.name
        },
        category: {
          id: documentRef.data()?.category.id,
          name: documentRef.data()?.category.name,
          parentName: documentRef.data()?.category.parentName
        },
        discount: {
          id: documentRef.data()?.discount.id,
          percentage: documentRef.data()?.discount.percentage,
          startDate: documentRef.data()?.discount.startDate,
          endDate: documentRef.data()?.discount.endDate
        },
        paginationKey: documentRef.data()?.paginationKey
      }
      return one
    }
    return null
  }

  async delete (id: string): Promise<void> {
    const ordersQuerySnapshot = await this.firestoreDB.collection(this._orderCollectionName)
      .where('status', 'not-in', [OrderStatuses.DELIVERED, OrderStatuses.CANCELLED])
      .get()
    if (!ordersQuerySnapshot.empty) {
      let exists = false
      for (const order of ordersQuerySnapshot.docs) {
        const orderProductsQuerySnapshot = await order.ref.collection(this._orderSubcollectionName) //* Subcollection
          .where(new FieldPath('product', 'id'), '==', id)
          .limit(1)
          .get()
        if (!orderProductsQuerySnapshot.empty) { //* At least one order associated to the product id
          exists = true
          break
        }
      }
      if (!exists) {
        const batch = this.firestoreDB.batch()
        const documentRef = this._collectionRef.doc(id)
        batch.delete(documentRef)
        //* Product favorites delete
        const productFavoritesQuerySnapshot = await this.firestoreDB.collection(this._productFavoriteCollectionName)
          .where('productId', '==', id)
          .get()
        if (!productFavoritesQuerySnapshot.empty) {
          productFavoritesQuerySnapshot.forEach(productFavorite => {
            batch.delete(productFavorite.ref)
          })
        }
        //* Product reviews delete
        const productReviewsQuerySnapshot = await this.firestoreDB.collection(this._productReviewCollectionName)
          .where('productId', '==', id)
          .get()
        if (!productReviewsQuerySnapshot.empty) {
          productReviewsQuerySnapshot.forEach(productReview => {
            batch.delete(productReview.ref)
          })
        }
        //* Shopping carts delete (removing from subcollection)
        const shoppingCartsQuerySnapshot = await this.firestoreDB.collectionGroup(this._shoppingCartSubcollectionName)
          .where('id', '==', id)
          .get()
        if (!shoppingCartsQuerySnapshot.empty) {
          shoppingCartsQuerySnapshot.forEach(shoppingCart => {
            batch.delete(shoppingCart.ref)
          })
        }
        await batch.commit()
      } else {
        throw new ErrorResponse(
          PRODUCT_DELETE_ERROR_MESSAGE,
          StatusCodes.UNPROCESSABLE_ENTITY
        )
      }
    }
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<ProductDto>> {
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
    let all: ProductDto[] = []
    if (!querySnapshot.empty) {
      all = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data()?.name,
        description: doc.data()?.description,
        image: doc.data()?.image,
        price: doc.data()?.price,
        quantity: doc.data()?.quantity,
        createdAt: doc.data()?.createdAt,
        updatedAt: doc.data()?.updatedAt,
        store: {
          id: doc.data()?.store.id,
          name: doc.data()?.store.name
        },
        category: {
          id: doc.data()?.category.id,
          name: doc.data()?.category.name,
          parentName: doc.data()?.category.parentName
        },
        discount: {
          id: doc.data()?.discount.id,
          percentage: doc.data()?.discount.percentage,
          startDate: doc.data()?.discount.startDate,
          endDate: doc.data()?.discount.endDate
        },
        paginationKey: doc.data()?.paginationKey
      }))
    }
    const pagingResult: PagingResult<ProductDto> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }
}
