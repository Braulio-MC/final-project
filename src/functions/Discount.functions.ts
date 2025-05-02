import { FieldPath, FieldValue, Timestamp } from 'firebase-admin/firestore'
import * as v2 from 'firebase-functions/v2'
import { StatusCodes } from 'http-status-codes'
import { db } from '../core/FirebaseHelper'
import { FIRESTORE_COLLECTION_DISCOUNT, FIRESTORE_COLLECTION_PRODUCT } from '../core/Constants'

export const update = v2.https.onRequest(async (request, response) => {
  try {
    const collectionName = FIRESTORE_COLLECTION_DISCOUNT
    const productsCollectionName = FIRESTORE_COLLECTION_PRODUCT
    const id = request.body.data.id
    const name = request.body.data.name
    const percentage = request.body.data.percentage
    const startDate = request.body.data.startDate
    const endDate = request.body.data.endDate
    const storeId = request.body.data.storeId
    if (typeof id !== 'string' || typeof name !== 'string' || typeof storeId !== 'string') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id, name and storeId must be strings' })
      return
    }
    if (id === '' || name === '' || storeId === '') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id, name and storeId must not be empty' })
      return
    }
    if (typeof percentage !== 'number') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'percentage must be a number' })
      return
    }
    if (percentage < 1 || percentage > 100) {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'percentage must be between 1 and 100' })
      return
    }
    if (isNaN(startDate.value) || isNaN(endDate.value)) {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'startDate and endDate must be numbers' })
      return
    }
    const startDateTimestamp = Timestamp.fromMillis(+startDate.value)
    const endDateTimestamp = Timestamp.fromMillis(+endDate.value)
    if (startDateTimestamp.toMillis() < Timestamp.now().toMillis()) {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'startDate must be in the future' })
      return
    }
    if (startDateTimestamp.toMillis() >= endDateTimestamp.toMillis()) {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'startDate must be before endDate' })
      return
    }
    const updatedAt = FieldValue.serverTimestamp()
    const batch = db.batch()
    const docRef = db.collection(collectionName).doc(id)
    const updateObj = {
      name,
      percentage,
      startDate: startDateTimestamp,
      endDate: endDateTimestamp,
      storeId,
      updatedAt
    }
    batch.update(docRef, updateObj)
    const updateRelatedProductsObj = {
      'discount.percentage': percentage,
      'discount.startDate': startDateTimestamp,
      'discount.endDate': endDateTimestamp,
      updatedAt
    }
    const productsQuerySnapshot = await db.collection(productsCollectionName)
      .where(new FieldPath('discount', 'id'), '==', id)
      .get()
    if (!productsQuerySnapshot.empty) {
      productsQuerySnapshot.forEach(product => {
        batch.update(product.ref, updateRelatedProductsObj)
      })
    }
    await batch.commit()
    response.status(StatusCodes.OK).send({ data: 'Discount updated' })
  } catch (e) {
    console.error('An error occurred when update (discount) was called', e)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error updating discount' })
  }
})

export const remove = v2.https.onRequest(async (request, response) => {
  try {
    const collectionName = FIRESTORE_COLLECTION_DISCOUNT
    const productsCollectionName = FIRESTORE_COLLECTION_PRODUCT
    const id = request.body.data.id
    if (typeof id !== 'string') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id must be a string' })
      return
    }
    if (id === '') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id must not be empty' })
      return
    }
    const batch = db.batch()
    const docRef = db.collection(collectionName).doc(id)
    batch.delete(docRef)
    const updateProductsDiscountObj = {
      'discount.percentage': 0,
      'discount.startDate': Timestamp.fromDate(new Date(1970, 0)),
      'discount.endDate': Timestamp.fromDate(new Date(1970, 0)),
      updatedAt: FieldValue.serverTimestamp()
    }
    const productsQuerySnapshot = await db.collection(productsCollectionName)
      .where(new FieldPath('discount', 'id'), '==', id)
      .get()
    if (!productsQuerySnapshot.empty) {
      productsQuerySnapshot.forEach(product => {
        batch.update(product.ref, updateProductsDiscountObj)
      })
    }
    await batch.commit()
    response.status(StatusCodes.OK).send({ data: 'Discount removed' })
  } catch (e) {
    console.error('An error occurred when remove (discount) was called', e)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error removing discount' })
  }
})
