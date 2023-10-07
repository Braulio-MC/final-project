import {
    InvalidTokenError,
    UnauthorizedError,
    InsufficientScopeError
} from "express-oauth2-jwt-bearer"
import { INTERNAL_SERVER_ERROR } from "../common/constants.js"
import { response } from "../common/utils.js"
import ApiError from "../common/error.js"

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    if (err instanceof InsufficientScopeError) {
        const message = "Insufficient permissions"
        res.status(err.statusCode).json(response(err.statusCode, message))
    } else if (err instanceof InvalidTokenError) {
        const message = "Expired or invalid token"
        res.status(err.statusCode).json(response(err.statusCode, message))
    } else if (err instanceof UnauthorizedError) {
        const message = "Authentication required"
        res.status(err.statusCode).json(response(err.statusCode, message))
    } else if (err instanceof ApiError) {
        res.status(err.statusCode).json(err.reason)
    } else {
        const statusCode = INTERNAL_SERVER_ERROR
        const message = "Internal server error"
        res.status(statusCode).json(response(statusCode, message))
    }
}

export default errorHandler