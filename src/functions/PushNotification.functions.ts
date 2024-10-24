import * as v2 from 'firebase-functions/v2'
import ErrorResponse from '../core/ErrorResponse'
import { StatusCodes } from 'http-status-codes'
import { FieldValue } from 'firebase-admin/firestore'
import { db } from '../core/FirebaseHelper'
import { firestoreConfig } from '../core/Configuration'

export const create = v2.https.onRequest((request, response) => {
  const collectionName = firestoreConfig.user as string
  const subCollectionName = firestoreConfig.userToken as string
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
  db.collection(collectionName)
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
  const collectionName = firestoreConfig.user as string
  const subCollectionName = firestoreConfig.userToken as string
  const userId = request.body.data.userId
  const token = request.body.data.token
  if (typeof userId !== 'string' || typeof token !== 'string') {
    throw new ErrorResponse('userId and token must be strings', StatusCodes.BAD_REQUEST)
  }
  if (userId === '' || token === '') {
    throw new ErrorResponse('userId and token must not be empty', StatusCodes.BAD_REQUEST)
  }
  const userTokens = await db.collection(collectionName)
    .doc(userId)
    .collection(subCollectionName)
    .where('userId', '==', userId)
    .where('token', '==', token)
    .get()
  if (!userTokens.empty) {
    const batch = db.batch()
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
