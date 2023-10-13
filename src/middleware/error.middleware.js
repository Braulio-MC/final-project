import {
    InvalidTokenError,
    UnauthorizedError,
    InsufficientScopeError
} from "express-oauth2-jwt-bearer"
import {
    ValidationError,
    ForeignKeyConstraintError,
    UniqueConstraintError,
    ConnectionError
} from "sequelize"
import { StatusCodes } from "http-status-codes"
import { response } from "../common/utils.js"
import ApiError from "../common/error.js"

/**
 * 
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    if (err instanceof InsufficientScopeError) {
        const message = "Insufficient permissions"
        res.status(err.statusCode).json(response(message, err.statusCode))
    } else if (err instanceof InvalidTokenError) {
        const message = "Expired or invalid token"
        res.status(err.statusCode).json(response(message, err.statusCode))
    } else if (err instanceof UnauthorizedError) {
        const message = "Authentication required"
        res.status(err.statusCode).json(response(message, err.statusCode))
    } else if (err instanceof ValidationError) {
        const message = err.errors.map(e => {
            if (e.type === "notNull Violation")
                return e.message.split(".")[1]
            else if (e.type === "unique violation")
                return `${e.value} body field conflicted with ${e.type}`
            else if (e.type === "Validation error")
                return `${e.path} body field conflicted with: ${e.message}`
        })
        const statusCode = StatusCodes.BAD_REQUEST
        res.status(statusCode).json(response(message, statusCode))
    } else if (err instanceof ForeignKeyConstraintError) {
        const message = "Unprocessable request due to conflict with foreign key constraint, request body has field(s) that does not comply with constraint"
        const statusCode = StatusCodes.BAD_REQUEST
        res.status(statusCode).json(response(message, statusCode))
    } else if (err instanceof UniqueConstraintError) {
        res.status(500).json(response(err, 500))  // Temporary
    } else if (err instanceof ConnectionError) {
        const message = "Unable to connect to storage"
        const statusCode = StatusCodes.SERVICE_UNAVAILABLE
        res.status(statusCode).json(response(message, statusCode))
    } else if (err instanceof ApiError) {
        res.status(err.statusCode).json(err.reason)
    } else {
        const message = "Internal server error"
        const statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        res.status(statusCode).json(response(message, statusCode))
    }
}

export default errorHandler