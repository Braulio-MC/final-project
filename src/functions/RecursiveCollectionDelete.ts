import * as v2 from 'firebase-functions/v2'
import { StatusCodes } from 'http-status-codes'
import { firebaseHelper } from '../di/Container'

export const recursiveCollectionDelete = v2.https.onRequest((request, response) => {
  const collectionName = request.body.data.collectionName
  const documentId = request.body.data.documentId
  if (typeof collectionName !== 'string' || typeof documentId !== 'string') {
    response.status(StatusCodes.BAD_REQUEST).send({ data: 'Collection name and document id must be strings' })
    return
  }
  if (collectionName === '' || documentId === '') {
    response.status(StatusCodes.BAD_REQUEST).send({ data: 'Collection name and document id must not be empty' })
    return
  }
  const ref = firebaseHelper.firestore.collection(collectionName).doc(documentId)
  firebaseHelper.firestore.recursiveDelete(ref)
    .then(_ => {
      response.status(StatusCodes.OK).send({ data: 'Collection deleted' })
    })
    .catch(e => {
      console.error('An error occurred when recursiveCollectionDelete was called', e)
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error deleting collection' })
    })
})
