import * as v2 from 'firebase-functions/v2'
import { db } from '../core/FirebaseHelper'
import { firestoreConfig } from '../core/Configuration'
import { FieldPath, FieldValue } from 'firebase-admin/firestore'
import { StatusCodes } from 'http-status-codes'

export const update = v2.https.onRequest(async (request, response) => {
  try {
    const collectionName = firestoreConfig.category as string
    const productsCollectionName = firestoreConfig.product as string
    const id = request.body.data.id
    const name = request.body.data.name
    const parentId = request.body.data.parentId
    const parentName = request.body.data.parentName
    const storeId = request.body.data.storeId
    if (typeof id !== 'string' || typeof name !== 'string' || typeof parentId !== 'string' || typeof parentName !== 'string' || typeof storeId !== 'string') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id, name, parentId, parentName and storeId must be strings' })
      return
    }
    if (id === '' || name === '' || storeId === '') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id, name and storeId must not be empty' })
      return
    }
    const updatedAt = FieldValue.serverTimestamp()
    const batch = db.batch()
    const docRef = db.collection(collectionName).doc(id)
    const updateObj = {
      name,
      parent: {
        id: parentId,
        name: parentName
      },
      storeId,
      updatedAt
    }
    batch.update(docRef, updateObj)
    const updateRelatedProductsObj = {
      'category.name': name,
      'category.parentName': parentName,
      updatedAt
    }
    const productsQuerySnapshot = await db.collection(productsCollectionName)
      .where(new FieldPath('category', 'id'), '==', id)
      .get()
    if (!productsQuerySnapshot.empty) {
      productsQuerySnapshot.forEach(product => {
        batch.update(product.ref, updateRelatedProductsObj)
      })
    }
    await batch.commit()
    response.status(StatusCodes.OK).send({ data: 'Category updated' })
  } catch (e) {
    console.error('An error occurred when update (category) was called', e)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error updating category' })
  }
})

export const remove = v2.https.onRequest(async (request, response) => {
  try {
    const collectionName = firestoreConfig.category as string
    const productsCollectionName = firestoreConfig.product as string
    const id = request.body.data.id
    if (typeof id !== 'string') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id must be a string' })
      return
    }
    if (id === '') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id must not be empty' })
      return
    }
    const productsQuerySnapshot = await db.collection(productsCollectionName)
      .where(new FieldPath('category', 'id'), '==', id)
      .limit(1)
      .get()
    if (productsQuerySnapshot.empty) {
      await db.collection(collectionName).doc(id).delete()
      response.status(StatusCodes.OK).send({ data: 'Category deleted' })
    } else {
      response.status(StatusCodes.UNPROCESSABLE_ENTITY).send({ data: 'Category cannot be deleted because it is still in use' })
    }
  } catch (e) {
    console.error('An error occurred when remove (category) was called', e)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error removing category' })
  }
})
