import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp({
  credential: applicationDefault()
})

export const db = getFirestore()
db.settings({
  ignoreUndefinedProperties: true
})
