import { Request, Response, NextFunction } from 'express'
import {
  auth,
  claimCheck,
  InsufficientScopeError
} from 'express-oauth2-jwt-bearer'
import { auth0Config } from '../core/Configuration'

export const checkAccessToken = auth({
  audience: auth0Config.apiAudience,
  issuerBaseURL: auth0Config.issuer
})

export const checkRequiredPermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissionCheck = claimCheck((payload) => {
      const permissions = (payload.permissions ?? []) as string[]
      const hasPermissions = requiredPermissions.every((requiredPermission) =>
        permissions.includes(requiredPermission)
      )
      if (!hasPermissions) {
        throw new InsufficientScopeError()
      }
      return hasPermissions
    })
    permissionCheck(req, res, next)
  }
}
