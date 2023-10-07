import ApiError from "../common/error.js"
import { NOT_FOUND } from "../common/constants.js"

const notFoundHandler = (req, res, next) => {
    const message = "Endpoint not found"
    const error = new ApiError(NOT_FOUND, message, { name: "Not Found" })
    next(error)
}

export default notFoundHandler
  