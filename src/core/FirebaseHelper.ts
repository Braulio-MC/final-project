import { initializeApp, App, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getStorage, Storage } from 'firebase-admin/storage'
import { getMessaging, Messaging } from 'firebase-admin/messaging'
import serviceAccount from '../../firebase.json'
import { singleton } from 'tsyringe'

@singleton()
export class FirebaseHelper {
  private _app: App | null = null
  private _firestoreDb: Firestore | null = null
  private _firebaseStorage: Storage | null = null
  private _firebaseMessaging: Messaging | null = null

  private initializeApp (): App {
    const bucketRef = process.env.FIREB_STORAGE_BUCKET
    if (bucketRef == null) {
      throw new Error('Firebase Storage bucket not configured in environment variables')
    }
    return initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
      storageBucket: bucketRef
    })
  }

  private get app (): App {
    if (this._app == null) {
      this._app = this.initializeApp()
    }
    return this._app
  }

  get firestore (): Firestore {
    if (this._firestoreDb == null) {
      this._firestoreDb = getFirestore(this.app)
      this._firestoreDb.settings({
        ignoreUndefinedProperties: true
      })
    }
    return this._firestoreDb
  }

  get storage (): Storage {
    if (this._firebaseStorage == null) {
      this._firebaseStorage = getStorage(this.app)
    }
    return this._firebaseStorage
  }

  get messaging (): Messaging {
    if (this._firebaseMessaging == null) {
      this._firebaseMessaging = getMessaging(this.app)
    }
    return this._firebaseMessaging
  }
}
