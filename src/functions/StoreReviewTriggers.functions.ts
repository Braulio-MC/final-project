import { onDocumentWritten } from 'firebase-functions/v2/firestore'
import { FIRESTORE_COLLECTION_STORE } from '../core/Constants'
import { firebaseHelper } from '../di/Container'

export const onStoreReviewWrite = onDocumentWritten('store-reviews/{reviewId}', async (event) => {
  const before = event.data?.before?.data() ?? null
  const after = event.data?.after?.data() ?? null

  if ((before == null) && (after == null)) return

  const storeId = after?.storeId ?? before?.storeId
  if (storeId == null) return

  const storeRef = firebaseHelper.firestore.collection(FIRESTORE_COLLECTION_STORE).doc(storeId)

  await firebaseHelper.firestore.runTransaction(async (transaction) => {
    const storeDoc = await transaction.get(storeRef)
    if (!storeDoc.exists) return
    let totalRating = storeDoc.data()?.totalRating as number ?? 0
    let totalReviews = storeDoc.data()?.totalReviews as number ?? 0
    if ((before != null) && (after != null)) {
      // Review updated
      const afterRating = after.rating as number
      const beforeRating = before.rating as number
      totalRating -= beforeRating
      totalRating += afterRating
    } else if (after != null) {
      // Review created
      const afterRating = after.rating as number
      totalRating += afterRating
      totalReviews++
    } else if (before != null) {
      // Review deleted
      const beforeRating = before.rating as number
      totalRating -= beforeRating
      totalReviews--
    }
    const newRating = totalReviews > 0 ? totalRating / totalReviews : 0
    transaction.update(storeRef, {
      rating: newRating,
      totalRating,
      totalReviews
    })
  })
})
