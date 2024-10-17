import { FieldPath, FieldValue, Timestamp } from 'firebase-admin/firestore'
import * as v2 from 'firebase-functions/v2'
import { StatusCodes } from 'http-status-codes'
import { db, firebaseStorage } from '../core/FirebaseHelper'
import { firestoreConfig } from '../core/Configuration'
import OrderStatuses from '../core/OrderStatuses'
import ErrorResponse from '../core/ErrorResponse'

export const update = v2.https.onRequest(async (request, response) => {
  try {
    const collectionName = firestoreConfig.product as string
    const productFavoritesCollectionName = firestoreConfig.productFavorite as string
    const shoppingCartProductsCollectionName = firestoreConfig.shoppingCartProducts as string
    const id = request.body.data.id
    const name = request.body.data.name
    const description = request.body.data.description
    const price = request.body.data.price
    const image = request.body.data.image
    const quantity = request.body.data.quantity
    const categoryId = request.body.data.categoryId
    const categoryName = request.body.data.categoryName
    const categoryParentName = request.body.data.categoryParentName
    const storeId = request.body.data.storeId
    const storeName = request.body.data.storeName
    const usingDefaultDiscount = request.body.data.usingDefaultDiscount
    const discountId = request.body.data.discountId
    const discountPercentage = request.body.data.discountPercentage
    const discountStartDate = request.body.data.discountStartDate
    const discountEndDate = request.body.data.discountEndDate
    if (typeof id !== 'string' || typeof name !== 'string' || typeof description !== 'string' || typeof image !== 'string' || typeof categoryId !== 'string' || typeof categoryName !== 'string' || typeof categoryParentName !== 'string' || typeof storeId !== 'string' || typeof storeName !== 'string' || typeof discountId !== 'string') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id, name, description, image, categoryId, categoryName, categoryParentName, storeId, storeName, discountId must be strings' })
      return
    }
    if (id === '' || name === '' || description === '' || categoryId === '' || categoryName === '' || storeId === '' || storeName === '' || discountId === '') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id, name, description, categoryId, categoryName, storeId, storeName, discountId must not be empty' })
      return
    }
    if (typeof price !== 'number' || typeof quantity !== 'number' || typeof discountPercentage !== 'number') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'price, quantity, discountPercentage must be numbers' })
      return
    }
    if (typeof usingDefaultDiscount !== 'boolean') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'usingDefaultDiscount must be a boolean' })
      return
    }
    if (price < 1 || quantity < 1) {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'price and quantity must be greater than 0' })
      return
    }
    if (discountPercentage < 0 || discountPercentage > 100) {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'discountPercentage must be between 1 and 100' })
      return
    }
    if (isNaN(discountStartDate.value) || isNaN(discountEndDate.value)) {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'discountStartDate and discountEndDate must be numbers' })
      return
    }
    const startDateTimestamp = Timestamp.fromMillis(+discountStartDate.value)
    const endDateTimestamp = Timestamp.fromMillis(+discountEndDate.value)
    if (!usingDefaultDiscount) {
      if (startDateTimestamp.toMillis() < Timestamp.now().toMillis()) {
        response.status(StatusCodes.BAD_REQUEST).send({ data: 'discountStartDate must be in the future' })
        return
      }
      if (startDateTimestamp.toMillis() >= endDateTimestamp.toMillis()) {
        response.status(StatusCodes.BAD_REQUEST).send({ data: 'discountStartDate must be before discountEndDate' })
        return
      }
    }
    const batch = db.batch()
    const updatedAt = FieldValue.serverTimestamp()
    const updateObj: { [k: string]: any } = {
      name,
      description,
      price,
      quantity,
      category: {
        id: categoryId,
        name: categoryName,
        parentName: categoryParentName
      },
      store: {
        id: storeId,
        name: storeName
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
    const productRef = db.collection(collectionName).doc(id)
    batch.update(productRef, updateObj)
    const productFavoritesQuerySnapshot = await db.collection(productFavoritesCollectionName)
      .where('productId', '==', id)
      .get()
    if (!productFavoritesQuerySnapshot.empty) {
      productFavoritesQuerySnapshot.forEach(productFavorite => {
        batch.update(productFavorite.ref, updateProductFavoritesObj)
      })
    }
    const shoppingCartProductsQuerySnapshot = await db.collectionGroup(shoppingCartProductsCollectionName)
      .where(new FieldPath('product', 'id'), '==', id)
      .get()
    if (!shoppingCartProductsQuerySnapshot.empty) {
      shoppingCartProductsQuerySnapshot.forEach(shoppingCartProduct => {
        batch.update(shoppingCartProduct.ref, updateShoppingCartProductsObj)
      })
    }
    await batch.commit()
    response.status(StatusCodes.OK).send({ data: 'Product updated successfully' })
  } catch (e) {
    console.error('An error occurred when update (product) was called', e)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error updating product' })
  }
})

export const remove = v2.https.onRequest(async (request, response) => {
  try {
    const collectionName = firestoreConfig.product as string
    const orderCollectionName = firestoreConfig.order as string
    const orderLinesCollectionName = firestoreConfig.orderLines as string
    const productFavoritesCollectionName = firestoreConfig.productFavorite as string
    const productReviewsCollectionName = firestoreConfig.productReview as string
    const shoppingCartProductsCollectionName = firestoreConfig.shoppingCartProducts as string
    const id = request.body.data.id
    if (typeof id !== 'string') {
      throw new Error('id must be a string')
    }
    if (id === '') {
      throw new Error('id must not be empty')
    }
    const ordersQuerySnapshot = await db.collection(orderCollectionName)
      .where('status', '!=', OrderStatuses.DELIVERED)
      .get()
    let isProductInNonDeliveredOrder = false
    for (const order of ordersQuerySnapshot.docs) {
      const productsSnapshot = await order.ref.collection(orderLinesCollectionName)
        .where(new FieldPath('product', 'id'), '==', id)
        .get()
      if (!productsSnapshot.empty) {
        isProductInNonDeliveredOrder = true
        break
      }
    }
    if (!isProductInNonDeliveredOrder) {
      const batch = db.batch()
      const productRef = db.collection(collectionName).doc(id)
      const productImageUrl = await (await productRef.get()).data()?.image
      batch.delete(productRef)
      const productFavoritesQuerySnapshot = await db.collection(productFavoritesCollectionName)
        .where('productId', '==', id)
        .get()
      if (!productFavoritesQuerySnapshot.empty) {
        productFavoritesQuerySnapshot.forEach(productFavorite => {
          batch.delete(productFavorite.ref)
        })
      }
      const productReviewsQuerySnapshot = await db.collection(productReviewsCollectionName)
        .where('productId', '==', id)
        .get()
      if (!productReviewsQuerySnapshot.empty) {
        productReviewsQuerySnapshot.forEach(productReview => {
          batch.delete(productReview.ref)
        })
      }
      const shoppingCartProductsQuerySnapshot = await db.collectionGroup(shoppingCartProductsCollectionName)
        .where(new FieldPath('product', 'id'), '==', id)
        .get()
      if (!shoppingCartProductsQuerySnapshot.empty) {
        shoppingCartProductsQuerySnapshot.forEach(shoppingCartProduct => {
          batch.delete(shoppingCartProduct.ref)
        })
      }
      batch.commit()
        .then(async _ => {
          // Delete product image from storage
          // development image path
          const image = decodeURIComponent(productImageUrl.split('.com/')[1])
          // production image path
          // const image = decodeURIComponent(productImageUrl.split('/o/')[1].split('?alt=media')[0])
          if (image !== '') {
            await firebaseStorage.bucket().file(image).delete()
          }
          response.status(StatusCodes.OK).send({ data: 'Product removed successfully' })
        })
        .catch(e => {
          console.error('An error occurred when remove (product) was called', e)
          throw new ErrorResponse(e, StatusCodes.INTERNAL_SERVER_ERROR)
        })
    } else {
      throw new Error('Product is in non-delivered order')
    }
  } catch (e: any) {
    console.error('An error occurred when remove (product) was called', e)
    throw new ErrorResponse(e, StatusCodes.INTERNAL_SERVER_ERROR)
  }
})
