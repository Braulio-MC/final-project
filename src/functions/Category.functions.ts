import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { FieldValue } from 'firebase-admin/firestore'
import { FIRESTORE_COLLECTION_CATEGORY, FIRESTORE_COLLECTION_PRODUCT } from '../core/Constants'
import { firebaseHelper } from '../di/Container'

export const update = onCall(async (request, _response) => {
  try {
    const collectionName = FIRESTORE_COLLECTION_CATEGORY
    const productsCollectionName = FIRESTORE_COLLECTION_PRODUCT
    const { id, currentName, name, storeId } = request.data

    if (typeof id !== 'string' || typeof currentName !== 'string' || typeof name !== 'string' || typeof storeId !== 'string') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input types',
        'id, currentName, name or storeId must be a string'
      )
    }

    if (id === '' || currentName === '' || name === '' || storeId === '') {
      throw new HttpsError(
        'invalid-argument',
        'Empty input values',
        'id, currentName, name or storeId must not be empty'
      )
    }

    const productsRef = firebaseHelper.firestore.collection(productsCollectionName)
    const updatedAt = FieldValue.serverTimestamp()
    const updateProductCategory = { id, name }
    const batchLimit = 300
    let batch = firebaseHelper.firestore.batch()
    let needUpdate = false
    let processedCount = 0
    let query = productsRef
      .where('categories', 'array-contains', { id, name: currentName })
      .limit(batchLimit)

    await firebaseHelper.firestore.collection(collectionName).doc(id)
      .update({
        name,
        storeId,
        updatedAt
      })

    while (true) {
      const productsSnapshot = await query.get()

      if (productsSnapshot.empty) break

      productsSnapshot.docs.forEach(doc => {
        const productCategories = doc.data().categories ?? []
        const categoryIndex = productCategories.findIndex((cat: { id: string }) => cat.id === id)
        if (categoryIndex > -1) {
          productCategories[categoryIndex] = {
            ...productCategories[categoryIndex],
            ...updateProductCategory
          }
          batch.update(doc.ref, {
            categories: productCategories,
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
        .where('categories', 'array-contains', { id, name: currentName })
        .startAfter(lastDoc)
        .limit(batchLimit)
    }

    if (needUpdate) {
      await batch.commit()
    }

    return {
      message: 'Category updated successfully',
      data: {
        updatedId: id,
        affectedProducts: processedCount
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

export const remove = onCall(async (request, _response) => {
  try {
    const collectionName = FIRESTORE_COLLECTION_CATEGORY
    const productsCollectionName = FIRESTORE_COLLECTION_PRODUCT
    const { id, name } = request.data

    if (typeof id !== 'string' || typeof name !== 'string' || id === '' || name === '') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input type or empty value',
        'id or name must be a non-empty string'
      )
    }

    const productsRef = firebaseHelper.firestore.collection(productsCollectionName)
    const updatedAt = FieldValue.serverTimestamp()
    const batchLimit = 300
    let needUpdate = false
    let processedCount = 0
    let batch = firebaseHelper.firestore.batch()
    let query = productsRef
      .where('categories', 'array-contains', { id, name })
      .limit(batchLimit)

    await firebaseHelper.firestore.collection(collectionName).doc(id).delete()

    while (true) {
      const productsSnapshot = await query.get()

      if (productsSnapshot.empty) break

      productsSnapshot.docs.forEach(doc => {
        const productCategories = doc.data().categories ?? []
        const categoryIndex = productCategories.findIndex((cat: { id: string }) => cat.id === id)
        if (categoryIndex > -1) {
          productCategories.splice(categoryIndex, 1)
          batch.update(doc.ref, {
            categories: productCategories,
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
        .where('categories', 'array-contains', { id, name })
        .startAfter(lastDoc)
        .limit(batchLimit)
    }

    if (needUpdate) {
      await batch.commit()
    }

    return {
      message: 'Category removed successfully',
      data: {
        removedId: id,
        affectedProducts: processedCount
      }
    }
  } catch (e) {
    if (e instanceof HttpsError) throw e
    throw new HttpsError(
      'internal',
      'Error removing category',
      'An internal error occurred while removing the category'
    )
  }
})
