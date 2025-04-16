import { config } from 'dotenv'

config()

export const appConfig = {
  develPort: process.env.DEVEL_PORT,
  prodPort: process.env.PROD_PORT
}

export const auth0Config = {
  issuer: process.env.AUTH0_ISSUER_BASE_URL,
  apiAudience: process.env.AUTH0_API_AUDIENCE
}

export const firebaseConfig = {
  bucketRef: process.env.FIRE_STORAGE_BUCKET
}

export const firestoreConfig = {
  category: process.env.FIRESTORE_COLLECTION_CATEGORY,
  product: process.env.FIRESTORE_COLLECTION_PRODUCT,
  discount: process.env.FIRESTORE_COLLECTION_DISCOUNT,
  shoppingCartProducts: process.env.FIRESTORE_SUBCOLLECTION_SHOPPING_CART,
  productFavorite: process.env.FIRESTORE_COLLECTION_PRODUCT_FAVORITE,
  order: process.env.FIRESTORE_COLLECTION_ORDER,
  orderLines: process.env.FIRESTORE_SUBCOLLECTION_ORDER,
  productReview: process.env.FIRESTORE_COLLECTION_PRODUCT_REVIEW,
  user: process.env.FIRESTORE_COLLECTION_USER,
  userToken: process.env.FIRESTORE_SUBCOLLECTION_USER_TOKEN
}

export const algoliaConfig = {
  applicationId: process.env.ALGOLIA_APPLICATION_ID,
  apiKey: process.env.ALGOLIA_SEARCH_API_KEY
}

export const getStreamConfig = {
  apiKey: process.env.GET_STREAM_API_KEY,
  apiSecret: process.env.GET_STREAM_API_SECRET,
  serverSideUserId: process.env.GET_STREAM_SERVER_SIDE_USER_ID
}
