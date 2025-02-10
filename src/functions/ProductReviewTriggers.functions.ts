import * as v2 from 'firebase-functions/v2'
import { db } from '../core/FirebaseHelper'

export const onProductReviewWrite = v2.firestore
  .onDocumentWritten('product-reviews/{reviewId}', async (event) => {
    const before = event.data?.before?.data() ?? null
    const after = event.data?.after?.data() ?? null

    if ((before == null) && (after == null)) return

    const productId = after?.productId ?? before?.productId
    if (productId == null) return

    const productRef = db.collection('products').doc(productId)

    await db.runTransaction(async (transaction) => {
      const productDoc = await transaction.get(productRef)
      if (!productDoc.exists) return
      let totalRating = productDoc.data()?.totalRating as number ?? 0
      let totalReviews = productDoc.data()?.totalReviews as number ?? 0
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
      transaction.update(productRef, {
        rating: newRating,
        totalRating,
        totalReviews
      })
    })
  })
