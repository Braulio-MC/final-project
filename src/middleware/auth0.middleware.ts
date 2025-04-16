import { auth } from 'express-oauth2-jwt-bearer'
import { auth0Config } from '../core/Configuration'

export const checkAccessToken = auth({
  audience: auth0Config.apiAudience,
  issuerBaseURL: auth0Config.issuer
})
