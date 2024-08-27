import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { getMessaging } from 'firebase-admin/messaging'
import { firebaseConfig } from './Configuration'

const app = initializeApp({
  credential: applicationDefault(),
  storageBucket: firebaseConfig.bucketRef
})

export const db = getFirestore()
db.settings({
  ignoreUndefinedProperties: true
})

export const firebaseStorage = getStorage(app)

export const firebaseMessaging = getMessaging(app)
