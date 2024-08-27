import { config } from 'dotenv'

config()

export const appConfig = {
  develPort: process.env.DEVEL_PORT,
  prodPort: process.env.PROD_PORT
}

export const auth0Config = {
  issuer: process.env.AUTH0_ISSUER_BASE_URL,
  apiAudience: process.env.AUTH0_API_AUDIENCE,
  signingAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
  domain: process.env.AUTH0_DOMAIN,
  m2mClientId: process.env.AUTH0_M2M_CLIENT_ID,
  m2mClientSecret: process.env.AUTH0_M2M_CLIENT_SECRET,
  mgmtAudience: process.env.AUTH0_MGMT_API_AUDIENCE
}

export const googleConfig = {
  firebaseAppCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS
}

export const firebaseConfig = {
  bucketRef: process.env.FIRE_STORAGE_BUCKET
}

export const firestoreConfig = {
  category: process.env.FIRESTORE_COLLECTION_CATEGORY,
  deliveryLocation: process.env.FIRESTORE_COLLECTION_DELIVERY_LOCATION,
  discount: process.env.FIRESTORE_COLLECTION_DISCOUNT,
  order: process.env.FIRESTORE_COLLECTION_ORDER,
  orderLines: process.env.FIRESTORE_SUBCOLLECTION_ORDER,
  paymentType: process.env.FIRESTORE_COLLECTION_PAYMENT_TYPE,
  product: process.env.FIRESTORE_COLLECTION_PRODUCT,
  productFavorite: process.env.FIRESTORE_COLLECTION_PRODUCT_FAVORITE,
  productReview: process.env.FIRESTORE_COLLECTION_PRODUCT_REVIEW,
  shoppingCart: process.env.FIRESTORE_COLLECTION_SHOPPING_CART,
  shoppingCartProducts: process.env.FIRESTORE_SUBCOLLECTION_SHOPPING_CART,
  store: process.env.FIRESTORE_COLLECTION_STORE,
  storeFavorite: process.env.FIRESTORE_COLLECTION_STORE_FAVORITE,
  storeReview: process.env.FIRESTORE_COLLECTION_STORE_REVIEW,
  user: process.env.FIRESTORE_COLLECTION_USER,
  userToken: process.env.FIRESTORE_SUBCOLLECTION_USER_TOKEN,
  paginationKey: process.env.FIRESTORE_COLLECTION_PAGINATION_KEY,
  discountDefaultId: process.env.FIRESTORE_COLLECTION_DISCOUNT_DEFAULT_ID,
  discountDefaultPercentage: process.env.FIRESTORE_COLLECTION_DISCOUNT_DEFAULT_PERCENTAGE,
  discountDefaultDate: process.env.FIRESTORE_COLLECTION_DISCOUNT_DEFAULT_DATE
}

export const algoliaConfig = {
  applicationId: process.env.ALGOLIA_APPLICATION_ID,
  apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
  index: process.env.ALGOLIA_INDEX
}

export const redisConfig = {
  serverUrl: process.env.REDIS_SERVER_URL
}

export const getStreamConfig = {
  apiKey: process.env.GET_STREAM_API_KEY,
  apiSecret: process.env.GET_STREAM_API_SECRET,
  serverSideUserId: process.env.GET_STREAM_SERVER_SIDE_USER_ID
}
