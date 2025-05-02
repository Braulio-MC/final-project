import { NextFunction, Request, Response } from 'express'
import { auth } from 'express-oauth2-jwt-bearer'

let authMiddleware: ReturnType<typeof auth> | null = null

export const checkAccessToken = (req: Request, res: Response, next: NextFunction): void => {
  if (authMiddleware == null) {
    const audience = process.env.AUTH0_API_AUDIENCE
    const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL

    if ((audience == null) || (issuerBaseURL == null)) {
      throw new Error('Auth0 configuration missing')
    }

    authMiddleware = auth({
      audience,
      issuerBaseURL
    })
  }

  return authMiddleware(req, res, next)
}
