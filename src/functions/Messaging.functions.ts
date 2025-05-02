import * as v2 from 'firebase-functions/v2'
import { db, firebaseMessaging } from '../core/FirebaseHelper'
import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '../core/ErrorResponse'
import { FIRESTORE_COLLECTION_USER, FIRESTORE_SUBCOLLECTION_USER_TOKEN } from '../core/Constants'

export const createTopic = v2.https.onRequest(async (request, response) => {
  const collectionName = FIRESTORE_COLLECTION_USER
  const subCollectionName = FIRESTORE_SUBCOLLECTION_USER_TOKEN
  const topic = request.body.data.topic
  const userId = request.body.data.userId
  const storeId = request.body.data.storeId
  if (typeof topic !== 'string' || typeof userId !== 'string' || typeof storeId !== 'string') {
    throw new Error('Invalid parameters: topic, userId and storeId must be strings')
  }
  if (topic === '' || userId === '' || storeId === '') {
    throw new Error('Invalid parameters: topic, userId and storeId must not be empty')
  }
  const userTokens = await db.collection(collectionName)
    .doc(userId)
    .collection(subCollectionName)
    .get()
  const storeTokens = await db.collection(collectionName)
    .doc(storeId)
    .collection(subCollectionName)
    .get()
  const participants = userTokens.docs.map(doc => doc.data().token).concat(storeTokens.docs.map(doc => doc.data().token))
  // 1000 subscriptions per request
  firebaseMessaging.subscribeToTopic(participants, topic)
    .then(_ => {
      response.status(StatusCodes.OK).send({ data: 'Topic created' })
    })
    .catch(e => {
      console.error('An error occurred when createTopic (messaging) was called:', e)
      throw new ErrorResponse(e, StatusCodes.INTERNAL_SERVER_ERROR)
    })
})

export const sendMessageToTopic = v2.https.onRequest(async (request, response) => {
  const topic = request.body.data.topic
  const message = request.body.data.message
  if (typeof topic !== 'string' || typeof message !== 'object') {
    throw new Error('Invalid parameters: topic must be a string and message must be an object')
  }
  if (topic === '' || Object.keys(message).length === 0) {
    throw new Error('Invalid parameters: topic must not be empty and message must not be empty')
  }
  if (!Object.keys(message).includes('notification')) {
    throw new Error('Invalid parameters: message must contain a notification object')
  }
  message.topic = topic
  firebaseMessaging.send(message)
    .then(_ => {
      // Delete the tokens that threw invalid token error
      response.status(StatusCodes.OK).send({ data: 'Message sent' })
    })
    .catch(e => {
      console.error('An error occurred when sendMessageToTopic (messaging) was called:', e)
      throw new ErrorResponse(e, StatusCodes.INTERNAL_SERVER_ERROR)
    })
})

export const sendMessageToUserDevices = v2.https.onRequest(async (request, response) => {
  const userId = request.body.data.userId
  const message = request.body.data.message
  if (typeof userId !== 'string' || typeof message !== 'object') {
    throw new Error('Invalid parameters: token must be a string and message must be an object')
  }
  if (userId === '' || Object.keys(message).length === 0) {
    throw new Error('Invalid parameters: token must not be empty and message must not be empty')
  }
  if (!Object.keys(message).includes('notification')) {
    throw new Error('Invalid parameters: message must contain a notification object')
  }
  // Retrive the tokens for the user id from firestore
  const collectionName = FIRESTORE_COLLECTION_USER
  const subCollectionName = FIRESTORE_SUBCOLLECTION_USER_TOKEN
  const userTokens = await db.collection(collectionName)
    .doc(userId)
    .collection(subCollectionName)
    .get()
  const tokens = userTokens.docs.map(doc => doc.data().token)
  if (tokens.length === 0) {
    throw new Error('No tokens found for the user id')
  }
  message.tokens = tokens
  firebaseMessaging.sendEachForMulticast(message)
    .then(_ => {
      response.status(StatusCodes.OK).send({ data: 'Message sent' })
    })
    .catch(e => {
      console.error('An error occurred when sendMessageToUserDevices (messaging) was called:', e)
      throw new ErrorResponse(e, StatusCodes.INTERNAL_SERVER_ERROR)
    })
})
