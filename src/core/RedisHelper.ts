import * as redis from 'redis'
import { redisConfig } from './Configuration'

export const redisClient = redis.createClient({
  url: redisConfig.serverUrl
})

// Development purposes only
redisClient.on('error', (error) => {
  console.error(error)
})
