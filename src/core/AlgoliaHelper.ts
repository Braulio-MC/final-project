import algoliasearch from 'algoliasearch/lite'
import { algoliaConfig } from './Configuration'
import { firestore } from 'firebase-functions'

export const algoliaClient = algoliasearch(algoliaConfig.applicationId as string, algoliaConfig.apiKey as string)
export const storeAlgoliaIndex = algoliaClient.initIndex(algoliaConfig.storeIndex as string)
export const productAlgoliaIndex = algoliaClient.initIndex(algoliaConfig.productIndex as string)

export const updateProductInIndex = firestore
  .document('/products/{productId}')
  .onUpdate(change => {
    const newData = change.after.data()
    newData.objectID = change.after.id
    return (productAlgoliaIndex as any).saveObject(newData)
  })

export const deleteProductInIndex = firestore
  .document('/products/{productId}')
  .onDelete(snapshot => {
    (productAlgoliaIndex as any).deleteObject(snapshot.id)
  })

export const updateStoreInIndex = firestore
  .document('/stores/{storeId}')
  .onUpdate(change => {
    const newData = change.after.data()
    newData.objectID = change.after.id
    return (storeAlgoliaIndex as any).saveObject(newData)
  })

export const deleteStoreInIndex = firestore
  .document('/stores/{storeId}')
  .onDelete(snapshot => {
    (storeAlgoliaIndex as any).deleteObject(snapshot.id)
  })
