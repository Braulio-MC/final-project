import { config } from 'dotenv'

config({ path: '.env.local' })

export const auth0Config = {
  issuer: process.env.AUTH0_ISSUER_BASE_URL,
  apiAudience: process.env.AUTH0_API_AUDIENCE
}

export const firebaseConfig = {
  bucketRef: process.env.FIRE_STORAGE_BUCKET
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
