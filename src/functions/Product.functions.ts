import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import {
  FIRESTORE_COLLECTION_PRODUCT,
  FIRESTORE_COLLECTION_PRODUCT_FAVORITE,
  FIRESTORE_SUBCOLLECTION_SHOPPING_CART
} from '../core/Constants'
import { firebaseHelper } from '../di/Container'

export const update = onCall(async (request, _response) => {
  try {
    const collectionName = FIRESTORE_COLLECTION_PRODUCT
    const productFavoritesCollectionName = FIRESTORE_COLLECTION_PRODUCT_FAVORITE
    const shoppingCartProductsCollectionName = FIRESTORE_SUBCOLLECTION_SHOPPING_CART
    const {
      id,
      name,
      description,
      price,
      image,
      quantity,
      categories,
      storeId,
      storeName,
      storeOwnerId,
      usingDefaultDiscount,
      discountId,
      discountPercentage,
      discountStartDate,
      discountEndDate
    } = request.data

    if (typeof id !== 'string' || typeof name !== 'string' || typeof description !== 'string' || typeof image !== 'string' || typeof storeId !== 'string' || typeof storeName !== 'string' || typeof storeOwnerId !== 'string' || typeof discountId !== 'string') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input types',
        'id, name, description, image, storeId, storeName, storeOwnerId or discountId must be strings'
      )
    }

    if (id === '' || name === '' || description === '' || storeId === '' || storeName === '' || storeOwnerId === '' || discountId === '') {
      throw new HttpsError(
        'invalid-argument',
        'Empty input values',
        'id, name, description, image, storeId, storeName, storeOwnerId or discountId must not be empty'
      )
    }

    if (!Array.isArray(categories)) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid categories format',
        'categories must be an array'
      )
    }

    if (categories.length === 0) {
      throw new HttpsError(
        'invalid-argument',
        'Empty categories',
        'At least one category must be provided'
      )
    }

    for (const category of categories) {
      if (typeof category.id !== 'string' || typeof category.name !== 'string') {
        throw new HttpsError(
          'invalid-argument',
          'Invalid category format',
          'Each category must have id and name as strings'
        )
      }
      if (category.id === '' || category.name === '') {
        throw new HttpsError(
          'invalid-argument',
          'Empty category values',
          'Category id and name must not be empty'
        )
      }
    }

    if (typeof price !== 'number' || typeof quantity !== 'number' || typeof discountPercentage !== 'number' ||
      typeof discountStartDate !== 'number' || typeof discountEndDate !== 'number') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid number types',
        'price, quantity, discountPercentage, discountStartDate or discountEndDate must be numbers'
      )
    }

    if (typeof usingDefaultDiscount !== 'boolean') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid boolean type',
        'usingDefaultDiscount must be a boolean'
      )
    }

    if (price < 1 || quantity < 1) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid values',
        'price and quantity must be greater than 0'
      )
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid discount percentage',
        'discountPercentage must be between 1 and 100'
      )
    }

    const startDateTimestamp = Timestamp.fromMillis(discountStartDate)
    const endDateTimestamp = Timestamp.fromMillis(discountEndDate)

    if (!usingDefaultDiscount && startDateTimestamp.toMillis() >= endDateTimestamp.toMillis()) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid date range',
        'discountStartDate must be before discountEndDate'
      )
    }

    let batch = firebaseHelper.firestore.batch()
    let productFavoritesCount = 0
    let shoppingCartProductsCount = 0
    let needUpdate = false
    const batchSize = 300
    const updatedAt = FieldValue.serverTimestamp()
    const updateObj: { [k: string]: any } = {
      name,
      description,
      price,
      quantity,
      categories: categories.map(cat => ({ id: cat.id, name: cat.name })),
      store: {
        id: storeId,
        name: storeName,
        ownerId: storeOwnerId
      },
      discount: {
        id: discountId,
        percentage: discountPercentage,
        startDate: startDateTimestamp,
        endDate: endDateTimestamp
      },
      updatedAt
    }
    const updateProductFavoritesObj: { [k: string]: any } = {
      productName: name,
      productDescription: description,
      updatedAt
    }
    const updateShoppingCartProductsObj: { [k: string]: any } = {
      'product.name': name,
      'product.description': description,
      'product.price': price,
      'product.discount': {
        id: discountId,
        percentage: discountPercentage,
        startDate: startDateTimestamp,
        endDate: endDateTimestamp
      },
      updatedAt
    }
    if (image !== '') {
      updateObj.image = image
      updateProductFavoritesObj.productImage = image
      updateShoppingCartProductsObj['product.image'] = image
    }

    await firebaseHelper.firestore.collection(collectionName)
      .doc(id)
      .update(updateObj)

    let favoritesQuery = firebaseHelper.firestore.collection(productFavoritesCollectionName)
      .where('productId', '==', id)
      .limit(batchSize)

    while (true) {
      const favoritesSnapshot = await favoritesQuery.get()

      if (favoritesSnapshot.empty) break

      favoritesSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, updateProductFavoritesObj)
        productFavoritesCount++
        needUpdate = true
      })

      if (needUpdate) {
        await batch.commit()
        batch = firebaseHelper.firestore.batch()
        needUpdate = false
      }

      if (favoritesSnapshot.docs.length < batchSize) break
      const lastDoc = favoritesSnapshot.docs[favoritesSnapshot.docs.length - 1]
      favoritesQuery = favoritesQuery
        .startAfter(lastDoc)
        .limit(batchSize)
    }

    let shoppingCartProductsQuery = firebaseHelper.firestore
      .collectionGroup(shoppingCartProductsCollectionName)
      .where('product.id', '==', id)
      .limit(batchSize)

    while (true) {
      const shoppingCartProductsSnapshot = await shoppingCartProductsQuery.get()

      if (shoppingCartProductsSnapshot.empty) break

      shoppingCartProductsSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, updateShoppingCartProductsObj)
        shoppingCartProductsCount++
        needUpdate = true
      })

      if (needUpdate) {
        await batch.commit()
        batch = firebaseHelper.firestore.batch()
        needUpdate = false
      }

      if (shoppingCartProductsSnapshot.docs.length < batchSize) break
      const lastDoc = shoppingCartProductsSnapshot.docs[shoppingCartProductsSnapshot.docs.length - 1]
      shoppingCartProductsQuery = shoppingCartProductsQuery
        .startAfter(lastDoc)
        .limit(batchSize)
    }

    if (needUpdate) {
      await batch.commit()
    }

    return {
      message: 'Product updated successfully',
      data: {
        updatedId: id,
        affectedProductFavorites: productFavoritesCount,
        affectedShoppingCartProducts: shoppingCartProductsCount
      }
    }
  } catch (e) {
    if (e instanceof HttpsError) throw e
    throw new HttpsError(
      'internal',
      'Error updating category',
      'An internal error occurred while updating the category'
    )
  }
})
