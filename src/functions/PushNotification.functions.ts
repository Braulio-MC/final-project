import * as v2 from 'firebase-functions/v2'
import ErrorResponse from '../core/ErrorResponse'
import { StatusCodes } from 'http-status-codes'
import { FieldValue } from 'firebase-admin/firestore'
import { FIRESTORE_COLLECTION_USER, FIRESTORE_SUBCOLLECTION_USER_TOKEN } from '../core/Constants'
import { firebaseHelper } from '../di/Container'

export const create = v2.https.onRequest((request, response) => {
  const collectionName = FIRESTORE_COLLECTION_USER
  const subCollectionName = FIRESTORE_SUBCOLLECTION_USER_TOKEN
  const userId = request.body.data.userId
  const token = request.body.data.token
  if (typeof userId !== 'string' || typeof token !== 'string') {
    throw new ErrorResponse('userId and token must be strings', StatusCodes.BAD_REQUEST)
  }
  if (userId === '' || token === '') {
    throw new ErrorResponse('userId and token must not be empty', StatusCodes.BAD_REQUEST)
  }
  const newObj = {
    userId,
    token,
    createdAt: FieldValue.serverTimestamp()
  }
  firebaseHelper.firestore.collection(collectionName)
    .doc(userId)
    .collection(subCollectionName)
    .add(newObj)
    .then(_ => {
      response.status(StatusCodes.OK).send({ data: 'Token created successfully' })
    })
    .catch(e => {
      console.error('An error occurred when create (push notification) was called:', e)
      throw new ErrorResponse(e, StatusCodes.INTERNAL_SERVER_ERROR)
    })
})

export const remove = v2.https.onRequest(async (request, response) => {
  const collectionName = FIRESTORE_COLLECTION_USER
  const subCollectionName = FIRESTORE_SUBCOLLECTION_USER_TOKEN
  const userId = request.body.data.userId
  const token = request.body.data.token
  if (typeof userId !== 'string' || typeof token !== 'string') {
    throw new ErrorResponse('userId and token must be strings', StatusCodes.BAD_REQUEST)
  }
  if (userId === '' || token === '') {
    throw new ErrorResponse('userId and token must not be empty', StatusCodes.BAD_REQUEST)
  }
  const userTokens = await firebaseHelper.firestore.collection(collectionName)
    .doc(userId)
    .collection(subCollectionName)
    .where('userId', '==', userId)
    .where('token', '==', token)
    .get()
  if (!userTokens.empty) {
    const batch = firebaseHelper.firestore.batch()
    userTokens.docs.forEach(doc => {
      batch.delete(doc.ref)
    })
    batch.commit()
      .then(_ => {
        response.status(StatusCodes.OK).send({ data: 'Token removed successfully' })
      })
      .catch(e => {
        console.error('An error occurred when remove (push notification) was called:', e)
        throw new ErrorResponse(e, StatusCodes.INTERNAL_SERVER_ERROR)
      })
  }
})
