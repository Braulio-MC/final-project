import { response } from "./utils.js"

class ApiError extends Error {
    constructor(message, statusCode, extra) {
        super(message)
        this.message = message
        this.statusCode = statusCode
        this.reason = response(message, statusCode, extra)
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ApiError