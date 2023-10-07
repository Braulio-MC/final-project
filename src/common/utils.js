import { 
    HTTP_INFORMATIONAL,
    HTTP_SUCCESSFUL,
    HTTP_REDIRECTION,
    HTTP_CLIENT_ERROR,
    HTTP_SERVER_ERROR

} from "./constants.js"

const capitalize = (str, lower = false) => {
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
  return str
}

export const response = (statusCode, message, extra) => {
    let isClientError = false
    let isServerError = false
    let status = HTTP_INFORMATIONAL
    if (statusCode >= 200 && statusCode < 300) {
        status = HTTP_SUCCESSFUL
    } else if (statusCode >= 300 && statusCode < 400) {
        status = HTTP_REDIRECTION
    } else if (statusCode >= 400 && statusCode < 500) {
        status = HTTP_CLIENT_ERROR
        isClientError = true
    } else if (statusCode >= 500 && statusCode < 600) {
        status = HTTP_SERVER_ERROR
        isServerError = true
    }
    const r = {
        "response status": status,
        "code": statusCode,
        "client error": isClientError,
        "server error": isServerError,
        message,
        ...extra
    }
    return r
}