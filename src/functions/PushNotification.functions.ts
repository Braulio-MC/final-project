import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { FieldValue } from 'firebase-admin/firestore'
import { FIRESTORE_COLLECTION_USER, FIRESTORE_SUBCOLLECTION_USER_TOKEN } from '../core/Constants'
import { firebaseHelper } from '../di/Container'

export const create = onCall(async (request, _response) => {
  try {
    const collectionName = FIRESTORE_COLLECTION_USER
    const subCollectionName = FIRESTORE_SUBCOLLECTION_USER_TOKEN
    const { userId, token } = request.data

    if (typeof userId !== 'string' || typeof token !== 'string') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input types',
        'userId and token must be strings'
      )
    }

    if (userId === '' || token === '') {
      throw new HttpsError(
        'invalid-argument',
        'Empty input values',
        'userId and token must not be empty'
      )
    }

    const newObj = {
      userId,
      token,
      createdAt: FieldValue.serverTimestamp()
    }
    const documentRef = await firebaseHelper.firestore.collection(collectionName)
      .doc(userId)
      .collection(subCollectionName)
      .add(newObj)

    return {
      message: 'Token added successfully',
      data: {
        documentId: documentRef.id
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

export const remove = onCall(async (request, _response) => {
  try {
    const collectionName = FIRESTORE_COLLECTION_USER
    const subCollectionName = FIRESTORE_SUBCOLLECTION_USER_TOKEN
    const { userId, token } = request.data

    if (typeof userId !== 'string' || typeof token !== 'string') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input types',
        'userId and token must be strings'
      )
    }

    if (userId === '' || token === '') {
      throw new HttpsError(
        'invalid-argument',
        'Empty input values',
        'userId and token must not be empty'
      )
    }

    let batch = firebaseHelper.firestore.batch()
    const batchLimit = 300
    const userTokensRef = firebaseHelper.firestore.collection(collectionName)
      .doc(userId)
      .collection(subCollectionName)
    let query = userTokensRef
      .where('userId', '==', userId)
      .where('token', '==', token)
      .limit(batchLimit)
    let needUpdate = false
    let processedCount = 0

    while (true) {
      const userTokensSnapshot = await query.get()

      if (userTokensSnapshot.empty) break

      userTokensSnapshot.docs.forEach((doc) => {
        if (doc.exists) {
          batch.delete(doc.ref)
          processedCount++
          needUpdate = true
        }
      })

      if (needUpdate) {
        await batch.commit()
        batch = firebaseHelper.firestore.batch()
        needUpdate = false
      }

      if (userTokensSnapshot.docs.length < batchLimit) break
      const lastDoc = userTokensSnapshot.docs[userTokensSnapshot.docs.length - 1]
      query = userTokensRef
        .where('userId', '==', userId)
        .where('token', '==', token)
        .startAfter(lastDoc)
        .limit(batchLimit)
    }

    if (needUpdate) {
      await batch.commit()
    }

    return {
      message: 'Token removed successfully',
      data: {
        processedCount
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
