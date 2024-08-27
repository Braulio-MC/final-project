import * as v2 from 'firebase-functions/v2'
import { firestoreConfig } from '../core/Configuration'
import { StatusCodes } from 'http-status-codes'
import { db } from '../core/FirebaseHelper'
import { FieldPath, FieldValue } from 'firebase-admin/firestore'
import OrderStatuses from '../core/OrderStatuses'

export const update = v2.https.onRequest(async (request, response) => {
  try {
    const collectionName = firestoreConfig.deliveryLocation as string
    const orderCollectionName = firestoreConfig.order as string
    const id = request.body.data.id
    const name = request.body.data.name
    const description = request.body.data.description
    const storeId = request.body.data.storeId
    if (typeof id !== 'string' || typeof name !== 'string' || typeof description !== 'string' || typeof storeId !== 'string') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id, name, description and storeId must be strings' })
      return
    }
    if (id === '' || name === '' || description === '' || storeId === '') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id, name, description and storeId must not be empty' })
      return
    }
    const updateObj = {
      name,
      description,
      storeId,
      updatedAt: FieldValue.serverTimestamp()
    }
    const ordersQuerySnapshot = await db.collection(orderCollectionName)
      .where(new FieldPath('deliveryLocation', 'id'), '==', id)
      .where('status', 'not-in', [OrderStatuses.DELIVERED, OrderStatuses.CANCELLED])
      .limit(1)
      .get()
    if (ordersQuerySnapshot.empty) {
      await db.collection(collectionName).doc(id).update(updateObj)
      response.status(StatusCodes.OK).send({ data: 'Delivery location updated successfully' })
    } else {
      response.status(StatusCodes.UNPROCESSABLE_ENTITY).send({ data: 'At least one active order is associated with the delivery location' })
    }
  } catch (e) {
    console.error('An error occurred when update (location) was called', e)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error updating delivery location' })
  }
})

export const remove = v2.https.onRequest(async (request, response) => {
  try {
    const collectionName = firestoreConfig.deliveryLocation as string
    const orderCollectionName = firestoreConfig.order as string
    const id = request.body.data.id
    if (typeof id !== 'string') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id must be a string' })
      return
    }
    if (id === '') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'id must not be empty' })
      return
    }
    const ordersQuerySnapshot = await db.collection(orderCollectionName)
      .where(new FieldPath('deliveryLocation', 'id'), '==', id)
      .where('status', 'not-in', [OrderStatuses.DELIVERED, OrderStatuses.CANCELLED])
      .limit(1)
      .get()
    if (ordersQuerySnapshot.empty) {
      await db.collection(collectionName).doc(id).delete()
      response.status(StatusCodes.OK).send({ data: 'Delivery location removed successfully' })
    } else {
      response.status(StatusCodes.UNPROCESSABLE_ENTITY).send({ data: 'At least one active order is associated with the delivery location' })
    }
  } catch (e) {
    console.error('An error occurred when remove (location) was called', e)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error removing delivery location' })
  }
})
