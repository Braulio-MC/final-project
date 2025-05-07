import { onDocumentWritten } from 'firebase-functions/firestore'
import { firebaseHelper } from '../di/Container'
import { FIRESTORE_COLLECTION_SHOPPING_CART } from '../core/Constants'
import { FieldValue } from 'firebase-admin/firestore'

export const onShoppingCartItemsWrite = onDocumentWritten('shopping-carts/{cartId}/shopping-cart-items/{itemId}', async (event) => {
  const { cartId } = event.params
  const before = event.data?.before?.data() ?? null
  const after = event.data?.after?.data() ?? null

  if ((before == null) && (after == null)) return

  const isCreate = after != null && before == null
  const isUpdate = before != null && after != null

  if (isUpdate) return

  const cartRef = firebaseHelper.firestore
    .collection(FIRESTORE_COLLECTION_SHOPPING_CART)
    .doc(cartId)

  try {
    await firebaseHelper.firestore.runTransaction(async (transaction) => {
      const cartDoc = await transaction.get(cartRef)
      const currentItemCount = cartDoc.data()?.itemCount as number ?? 0
      if (isCreate) {
        transaction.update(cartRef, {
          itemCount: currentItemCount + 1,
          updatedAt: FieldValue.serverTimestamp()
        })
      } else if (currentItemCount <= 1) {
        transaction.delete(cartRef)
      } else {
        transaction.update(cartRef, {
          itemCount: currentItemCount - 1,
          updatedAt: FieldValue.serverTimestamp()
        })
      }
    })
  } catch (error) {
    console.error(`Error processing cart ${cartId}:`, error)
  }
})
