import { 
    auth, 
    claimCheck, 
    InsufficientScopeError 
} from "express-oauth2-jwt-bearer"
import { auth0Vars } from "../config/configuration.js"

export const checkAccessToken =  auth({
    audience: auth0Vars.apiAudience,
    issuerBaseURL: auth0Vars.issuer,
    tokenSigningAlg: auth0Vars.signingAlg
})

export const checkRequiredPermissions = (requiredPermissions) => {
    return (req, res, next) => {
        const permissionCheck = claimCheck((payload) => {
            const permissions = payload.permissions || []
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
