import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { FIRESTORE_COLLECTION_DISCOUNT, FIRESTORE_COLLECTION_PRODUCT } from '../core/Constants'
import { firebaseHelper } from '../di/Container'

export const update = onCall(async (request, _response) => {
  try {
    const collectionName = FIRESTORE_COLLECTION_DISCOUNT
    const productsCollectionName = FIRESTORE_COLLECTION_PRODUCT
    const { id, name, percentage, startDate, endDate, storeId } = request.data

    if (typeof id !== 'string' || typeof name !== 'string' || typeof storeId !== 'string') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input types',
        'id, name and storeId must be strings'
      )
    }

    if (id === '' || name === '' || storeId === '') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input values',
        'id, name and storeId must not be empty'
      )
    }

    if (typeof percentage !== 'number' || typeof startDate !== 'number' || typeof endDate !== 'number') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input type',
        'percentage, startDate and endDate must be numbers'
      )
    }

    if (percentage < 1 || percentage > 100) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input value',
        'percentage must be between 1 and 100'
      )
    }

    const startDateTimestamp = Timestamp.fromMillis(startDate)
    const endDateTimestamp = Timestamp.fromMillis(endDate)
    if (startDateTimestamp.toMillis() < Timestamp.now().toMillis()) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input value',
        'startDate must be in the future'
      )
    }

    if (startDateTimestamp.toMillis() >= endDateTimestamp.toMillis()) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input value',
        'startDate must be before endDate'
      )
    }

    const productsRef = firebaseHelper.firestore.collection(productsCollectionName)
    const updatedAt = FieldValue.serverTimestamp()
    const updateProductDiscount = {
      'discount.percentage': percentage,
      'discount.startDate': startDateTimestamp,
      'discount.endDate': endDateTimestamp
    }
    const batchLimit = 300
    let batch = firebaseHelper.firestore.batch()
    let needUpdate = false
    let processedCount = 0
    let query = productsRef
      .where('discount.id', '==', id)
      .limit(batchLimit)

    await firebaseHelper.firestore.collection(collectionName).doc(id)
      .update({
        name,
        percentage,
        startDate: startDateTimestamp,
        endDate: endDateTimestamp,
        storeId,
        updatedAt
      })

    while (true) {
      const productsSnapshot = await query.get()

      if (productsSnapshot.empty) break

      productsSnapshot.docs.forEach(doc => {
        const productDiscount = doc.data().discount ?? {}
        if (productDiscount.id === id) {
          batch.update(doc.ref, {
            ...updateProductDiscount,
            updatedAt
          })
          processedCount++
          needUpdate = true
        }
      })

      if (needUpdate) {
        await batch.commit()
        batch = firebaseHelper.firestore.batch()
        needUpdate = false
      }

      if (productsSnapshot.docs.length < batchLimit) break
      const lastDoc = productsSnapshot.docs[productsSnapshot.docs.length - 1]
      query = productsRef
        .where('discount.id', '==', id)
        .startAfter(lastDoc)
        .limit(batchLimit)
    }

    if (needUpdate) {
      await batch.commit()
    }

    return {
      message: 'Discount updated successfully',
      data: {
        updatedId: id,
        affectedProducts: processedCount
      }
    }
  } catch (e) {
    if (e instanceof HttpsError) throw e
    throw new HttpsError(
      'internal',
      'Error updating discount',
      'An internal error occurred while updating the discount'
    )
  }
})

export const remove = onCall(async (request, _response) => {
  try {
    const collectionName = FIRESTORE_COLLECTION_DISCOUNT
    const productsCollectionName = FIRESTORE_COLLECTION_PRODUCT
    const { id } = request.data

    if (typeof id !== 'string' || id === '') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input type or empty value',
        'id must be a string and not empty'
      )
    }

    const productsRef = firebaseHelper.firestore.collection(productsCollectionName)
    const updatedAt = FieldValue.serverTimestamp()
    const defaultDiscountDate = Timestamp.fromDate(new Date(2000, 0, 1))
    const updateProductDiscount = {
      'discount.id': 'default',
      'discount.percentage': 0,
      'discount.startDate': defaultDiscountDate,
      'discount.endDate': defaultDiscountDate
    }
    const batchLimit = 300
    let batch = firebaseHelper.firestore.batch()
    let needUpdate = false
    let processedCount = 0
    let query = productsRef
      .where('discount.id', '==', id)
      .limit(batchLimit)

    await firebaseHelper.firestore.collection(collectionName).doc(id).delete()

    while (true) {
      const productsSnapshot = await query.get()

      if (productsSnapshot.empty) break

      productsSnapshot.docs.forEach(doc => {
        const productDiscount = doc.data().discount ?? {}
        if (productDiscount.id === id) {
          batch.update(doc.ref, {
            ...updateProductDiscount,
            updatedAt
          })
          processedCount++
          needUpdate = true
        }
      })

      if (needUpdate) {
        await batch.commit()
        batch = firebaseHelper.firestore.batch()
        needUpdate = false
      }

      if (productsSnapshot.docs.length < batchLimit) break
      const lastDoc = productsSnapshot.docs[productsSnapshot.docs.length - 1]
      query = productsRef
        .where('discount.id', '==', id)
        .startAfter(lastDoc)
        .limit(batchLimit)
    }

    if (needUpdate) {
      await batch.commit()
    }

    return {
      message: 'Discount removed successfully',
      data: {
        removedId: id,
        affectedProducts: processedCount
      }
    }
  } catch (e) {
    if (e instanceof HttpsError) throw e
    throw new HttpsError(
      'internal',
      'Error removing discount',
      'An internal error occurred while removing the discount'
    )
  }
})
