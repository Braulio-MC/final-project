import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { FIRESTORE_COLLECTION_USER, FIRESTORE_SUBCOLLECTION_USER_TOKEN } from '../core/Constants'
import { firebaseHelper } from '../di/Container'

async function checkTokenValidity (tokens: Array<{ id: string, token: string, collection: string }>): Promise<{
  validTokens: string[]
  invalidTokens: Array<{ id: string, token: string, collection: string }>
}> {
  const validTokens: string[] = []
  const invalidTokens: Array<{ id: string, token: string, collection: string }> = []
  const sendChunkSizeLimit = 500
  const tokenChunks = []

  for (let i = 0; i < tokens.length; i += sendChunkSizeLimit) {
    tokenChunks.push(tokens.slice(i, i + sendChunkSizeLimit))
  }

  for (const chunk of tokenChunks) {
    try {
      const message = { tokens: chunk.map(t => t.token) }
      const validateTokensResponse = await firebaseHelper.messaging.sendEachForMulticast(message, true)
      validateTokensResponse.responses.forEach((resp, idx) => {
        const tokenObj = chunk[idx]
        if (resp.success) {
          validTokens.push(tokenObj.token)
        } else if (resp.error?.code === 'messaging/invalid-registration-token' ||
                   resp.error?.code === 'messaging/registration-token-not-registered') {
          invalidTokens.push(tokenObj)
        } else {
          validTokens.push(tokenObj.token)
        }
      })
    } catch (error) {
      // Avoid lost tokens in case of error
      chunk.forEach(tokenObj => validTokens.push(tokenObj.token))
    }
  }

  return { validTokens, invalidTokens }
}

export const createTopic = onCall(async (request, _response) => {
  try {
    const collectionName = FIRESTORE_COLLECTION_USER
    const subCollectionName = FIRESTORE_SUBCOLLECTION_USER_TOKEN
    const { topic, userId, storeId } = request.data

    if (typeof topic !== 'string' || typeof userId !== 'string' || typeof storeId !== 'string') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input types',
        'topic, userId or storeId must be strings'
      )
    }

    if (topic === '' || userId === '' || storeId === '') {
      throw new HttpsError(
        'invalid-argument',
        'Empty input values',
        'topic, userId or storeId must not be empty'
      )
    }

    const userTokens = await firebaseHelper.firestore.collection(collectionName)
      .doc(userId)
      .collection(subCollectionName)
      .get()
    const storeTokens = await firebaseHelper.firestore.collection(collectionName)
      .doc(storeId)
      .collection(subCollectionName)
      .get()
    const allTokens = [
      ...userTokens.docs.map(doc => ({ id: doc.id, token: doc.data().token, collection: 'user' })),
      ...storeTokens.docs.map(doc => ({ id: doc.id, token: doc.data().token, collection: 'store' }))
    ]
    const subscribeChunkSizeLimit = 1000
    const { validTokens, invalidTokens } = await checkTokenValidity(allTokens)

    if (invalidTokens.length > 0) {
      const batch = firebaseHelper.firestore.batch()

      invalidTokens.forEach(tokenObj => {
        const ref = firebaseHelper.firestore.collection(collectionName)
          .doc(tokenObj.collection === 'user' ? userId : storeId)
          .collection(subCollectionName)
          .doc(tokenObj.id)
        batch.delete(ref)
      })

      await batch.commit()
    }

    for (let i = 0; i < validTokens.length; i += subscribeChunkSizeLimit) {
      const chunk = validTokens.slice(i, i + subscribeChunkSizeLimit)
      await firebaseHelper.messaging.subscribeToTopic(chunk, topic)
    }

    return {
      message: 'Topic created successfully',
      data: {
        topic,
        totalTokens: allTokens.length,
        validTokens: validTokens.length,
        invalidTokens: invalidTokens.length
      }
    }
  } catch (e) {
    if (e instanceof HttpsError) throw e
    throw new HttpsError(
      'internal',
      'Error creating topic',
      'An internal error occurred while creating the topic'
    )
  }
})

export const sendMessageToTopic = onCall(async (request, _response) => {
  try {
    const { topic, message } = request.data

    if (typeof topic !== 'string' || typeof message !== 'object') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input types',
        'topic must be a string and message must be an object'
      )
    }

    if (topic === '' || Object.keys(message).length === 0) {
      throw new HttpsError(
        'invalid-argument',
        'Empty input values',
        'topic must not be empty and message must not be empty'
      )
    }

    if (!Object.keys(message).includes('notification')) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid message format',
        'message must contain a notification object'
      )
    }

    message.topic = topic
    const sendMessageResponse = await firebaseHelper.messaging.send(message)

    return {
      message: 'Message sent successfully',
      data: {
        topic,
        messageId: sendMessageResponse
      }
    }
  } catch (e) {
    if (e instanceof HttpsError) throw e
    throw new HttpsError(
      'internal',
      'Error creating topic',
      'An internal error occurred while creating the topic'
    )
  }
})

export const sendMessageToUserDevices = onCall(async (request, _response) => {
  try {
    const collectionName = FIRESTORE_COLLECTION_USER
    const subCollectionName = FIRESTORE_SUBCOLLECTION_USER_TOKEN
    const { userId, message } = request.data

    if (typeof userId !== 'string' || typeof message !== 'object') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input types',
        'userId must be a string and message must be an object'
      )
    }

    if (userId === '' || Object.keys(message).length === 0) {
      throw new HttpsError(
        'invalid-argument',
        'Empty input values',
        'userId must not be empty and message must not be empty'
      )
    }

    if (!Object.keys(message).includes('notification')) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid message format',
        'message must contain a notification object'
      )
    }

    const userTokens = await firebaseHelper.firestore.collection(collectionName)
      .doc(userId)
      .collection(subCollectionName)
      .get()
    const tokens = userTokens.docs.map(doc => ({ id: doc.id, token: doc.data().token, collection: 'user' }))
    const sendChunkSizeLimit = 500
    const tokenChunks = []
    const { validTokens, invalidTokens } = await checkTokenValidity(tokens)

    if (invalidTokens.length > 0) {
      const batch = firebaseHelper.firestore.batch()

      invalidTokens.forEach(tokenObj => {
        const ref = firebaseHelper.firestore.collection(collectionName)
          .doc(userId)
          .collection(subCollectionName)
          .doc(tokenObj.id)
        batch.delete(ref)
      })

      await batch.commit()
    }

    for (let i = 0; i < validTokens.length; i += sendChunkSizeLimit) {
      tokenChunks.push(validTokens.slice(i, i + sendChunkSizeLimit))
    }

    for (const chunk of tokenChunks) {
      const messageWithTokens = { ...message, tokens: chunk }
      await firebaseHelper.messaging.sendEachForMulticast(messageWithTokens)
    }

    return {
      message: 'Message sent successfully',
      data: {
        userId,
        totalTokens: tokens.length,
        validTokens: validTokens.length,
        invalidTokens: invalidTokens.length
      }
    }
  } catch (e) {
    if (e instanceof HttpsError) throw e
    throw new HttpsError(
      'internal',
      'Error creating topic',
      'An internal error occurred while creating the topic'
    )
  }
})
