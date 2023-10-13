import { StatusCodes } from "http-status-codes"
import ApiError from "../common/error.js"

const notFoundHandler = (req, res, next) => {
    const message = "Endpoint not found"
    const error = new ApiError(message, StatusCodes.NOT_FOUND)
    next(error)
}

export default notFoundHandler
