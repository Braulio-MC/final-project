import { response } from "./utils.js"

class ApiError extends Error {
    constructor(statusCode, message, extra) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.reason = response(statusCode, message, extra)
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ApiError