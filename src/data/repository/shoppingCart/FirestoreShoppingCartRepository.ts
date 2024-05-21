import { inject, singleton } from 'tsyringe'
import ShoppingCartDto from '../../dto/ShoppingCartDto'
import IShoppingCartRepository from './IShoppingCartRepository'
import { CollectionReference, Firestore } from 'firebase-admin/firestore'
import Criteria from '../../../core/criteria/Criteria'
import FirestoreCriteriaConverter from '../../persistance/firestore/FirestoreCriteriaConverter'
import { PagingResult, ShoppingCartResult } from '../../../types'
import { firestoreConfig } from '../../../core/Configuration'
import ShoppingCartProductDto from '../../dto/ShoppingCartProductDto'

@singleton()
export default class FirestoreShoppingCartRepository implements IShoppingCartRepository {
  private readonly _collectionName = firestoreConfig.shoppingCart as string
  private readonly _subCollectionName = firestoreConfig.shoppingCartProducts as string
  private readonly _collectionRef: CollectionReference<ShoppingCartDto>
  private readonly _paginationKey = firestoreConfig.paginationKey as string

  constructor (
    @inject('FirestoreDB') private readonly firestoreDB: Firestore,
    @inject(FirestoreCriteriaConverter) private readonly converter: FirestoreCriteriaConverter
  ) {
    this._collectionRef = this.firestoreDB.collection(this._collectionName) as CollectionReference<ShoppingCartDto>
  }

  async create (shoppingCart: ShoppingCartDto, products: ShoppingCartProductDto[]): Promise<void> {
    const documentRef = await this._collectionRef.add(shoppingCart)
    for (const product of products) {
      await documentRef.collection(this._subCollectionName).add(product)
    }
  }

  async update (id: string, shoppingCart: Partial<ShoppingCartDto>, products: ShoppingCartProductDto[]): Promise<void> {
    await this._collectionRef.doc(id).update(shoppingCart)
    // const documentRef = this._collectionRef.doc(id)
    for (const product of products) {
      // await documentRef.collection(this._subCollectionName).doc(product.id).update(product)
      console.log(product)
    }
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<ShoppingCartResult>> {
    let ref = this._collectionRef.orderBy(this._paginationKey)
    if (after !== '') {
      ref = ref.startAfter(after).limit(limit)
    } else if (before !== '') {
      ref = ref.endBefore(before).limitToLast(limit)
    } else {
      ref = ref.limit(limit)
    }
    const querySnapshot = await ref.get()
    const all: ShoppingCartResult[] = []
    if (!querySnapshot.empty) {
      for (const doc of querySnapshot.docs) {
        const productsQuerySnapshot = await this._collectionRef.doc(doc.id).collection(this._subCollectionName).get()
        const products = productsQuerySnapshot.docs.map(product => ({
          objectId: product.id,
          id: product.data()?.id,
          name: product.data()?.name,
          image: product.data()?.image,
          price: product.data()?.price,
          quantity: product.data()?.quantity
        }))
        const product: ShoppingCartResult = {
          id: doc.id,
          userId: doc.data()?.userId,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
          store: {
            id: doc.data()?.store.id,
            name: doc.data()?.store.name
          },
          products,
          paginationKey: doc.data()?.paginationKey
        }
        all.push(product)
      }
    }
    const pagingResult: PagingResult<ShoppingCartResult> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }

  async findById (id: string): Promise<ShoppingCartResult | null> {
    const documentRef = await this._collectionRef.doc(id).get()
    if (documentRef.exists) {
      const productsQuerySnapshot = await this._collectionRef.doc(documentRef.id).collection(this._subCollectionName).get()
      const products = productsQuerySnapshot.docs.map(product => ({
        objectId: product.id,
        id: product.data()?.id,
        name: product.data()?.name,
        image: product.data()?.image,
        price: product.data()?.price,
        quantity: product.data()?.quantity
      }))
      const one: ShoppingCartResult = {
        id: documentRef.id,
        userId: documentRef.data()?.userId,
        createdAt: documentRef.data()?.createdAt,
        updatedAt: documentRef.data()?.updatedAt,
        store: {
          id: documentRef.data()?.store.id,
          name: documentRef.data()?.store.name
        },
        products,
        paginationKey: documentRef.data()?.paginationKey
      }
      return one
    }
    return null
  }

  async delete (id: string): Promise<void> {
    const documentRef = this._collectionRef.doc(id)
    await this.firestoreDB.recursiveDelete(documentRef) //* Managing subcollection delete
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<ShoppingCartResult>> {
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
    const all: ShoppingCartResult[] = []
    if (!querySnapshot.empty) {
      for (const doc of querySnapshot.docs) {
        const productsQuerySnapshot = await this._collectionRef.doc(doc.id).collection(this._subCollectionName).get()
        const products = productsQuerySnapshot.docs.map(product => ({
          objectId: product.id,
          id: product.data()?.id,
          name: product.data()?.name,
          image: product.data()?.image,
          price: product.data()?.price,
          quantity: product.data()?.quantity
        }))
        const product: ShoppingCartResult = {
          id: doc.id,
          userId: doc.data()?.userId,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
          store: {
            id: doc.data()?.store.id,
            name: doc.data()?.store.name
          },
          products,
          paginationKey: doc.data()?.paginationKey
        }
        all.push(product)
      }
    }
    const pagingResult: PagingResult<ShoppingCartResult> = {
      data: all,
      pagination: {
        prev: all.length > 0 && ((after !== '') || (before !== '')) ? all[0].paginationKey : null,
        next: all.length === limit ? all[all.length - 1].paginationKey : null
      }
    }
    return pagingResult
  }
}
