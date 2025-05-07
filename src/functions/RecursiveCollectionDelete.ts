import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { firebaseHelper } from '../di/Container'

export const recursiveCollectionDelete = onCall(async (request, _response) => {
  try {
    const { collectionName, documentId } = request.data

    if (typeof collectionName !== 'string' || typeof documentId !== 'string') {
      throw new HttpsError(
        'invalid-argument',
        'Invalid input types',
        'collectionName and documentId must be strings'
      )
    }

    if (collectionName === '' || documentId === '') {
      throw new HttpsError(
        'invalid-argument',
        'Empty input values',
        'collectionName and documentId must not be empty'
      )
    }

    const ref = firebaseHelper.firestore.collection(collectionName).doc(documentId)
    await firebaseHelper.firestore.recursiveDelete(ref)

    return {
      message: 'Collection deleted successfully'
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
