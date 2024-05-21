// import { validationResult } from "express-validator"
// import auth0Management from "../core/auth0.js"
// import { StatusCodes } from "http-status-codes"
// import { auth0Vars } from "../core/configuration.js"
// import ApiError from "../core/error.js"
// import { response } from "../core/utils.js"
// import { db } from "../core/firebasehelper.js"
// import { getStoreRating } from "./store.controller.js"

// export const createUser = async (req, res, next) => {
//     const {
//         app_metadata,
//         email,
//         given_name,
//         password,
//         picture,
//         username,
//         blocked,
//         email_verified,
//         name,
//         phone_number,
//         user_id,
//         user_metadata,
//         verify_email,
//         family_name,
//         nickname,
//         phone_verified,
//         connection
//     } = req.body
//     await auth0Management.createUser({
//         app_metadata,
//         email,
//         given_name,
//         password,
//         picture,
//         username,
//         blocked,
//         email_verified,
//         name,
//         phone_number,
//         user_id,
//         user_metadata,
//         verify_email,
//         family_name,
//         nickname,
//         phone_verified,
//         connection
//     })
//         .then(async (user) => {
//             await user.create({
//                 id: user_id
//             })
//                 .then((_) => {
//                     res.status(StatusCodes.OK).json(response(user))
//                 })
//                 .catch((err) => {
//                     next(err)
//                 })
//         })
//         .catch((err) => {
//             const error = new ApiError(err.message, err.statusCode)
//             next(error)
//         })
// }

// export const readUsers = async (req, res, next) => {
//     await auth0Management.getUsers()
//         .then((users) => {
//             res.status(StatusCodes.OK).json(response(users))
//         })
//         .catch((err) => {
//             const error = new ApiError(err.message, err.statusCode)
//             next(error)
//         })
// }

// export const readUser = async (req, res, next) => {
//     const { id } = req.params
//     await auth0Management.getUser({ id })
//         .then((user) => {
//             res.status(StatusCodes.OK).json(response(user))
//         })
//         .catch((err) => {
//             const error = new ApiError(err.message, err.statusCode)
//             next(error)
//         })
// }

// export const updateUser = async (req, res, next) => {
//     const { id } = req.params
//     const {
//         app_metadata,
//         email,
//         given_name,
//         password,
//         picture,
//         username,
//         blocked,
//         email_verified,
//         name,
//         phone_number,
//         user_metadata,
//         verify_email,
//         family_name,
//         nickname,
//         phone_verified,
//         connection
//     } = req.body
//     await auth0Management.updateUser({ id }, {
//         app_metadata,
//         email,
//         given_name,
//         password,
//         picture,
//         username,
//         blocked,
//         email_verified,
//         name,
//         phone_number,
//         user_metadata,
//         verify_email,
//         family_name,
//         nickname,
//         phone_verified,
//         connection
//     })
//         .then((user) => {
//             res.status(StatusCodes.OK).json(response(user))
//         })
//         .catch((err) => {
//             const error = new ApiError(err.message, err.statusCode)
//             next(error)
//         })
// }

// export const deleteUser = async (req, res, next) => {
//     const { id } = req.params
//     await auth0Management.deleteUser({ id })
//         .then(() => {
//             res.sendStatus(StatusCodes.NO_CONTENT)
//         })
//         .catch((err) => {
//             const error = new ApiError(err.message, err.statusCode)
//             next(error)
//         })
// }

// export const readUserPermissions = async (req, res, next) => {
//     const { id } = req.params
//     await auth0Management.getUserPermissions({ id })
//         .then((permissions) => {
//             res.status(StatusCodes.OK).json(response(permissions))
//         })
//         .catch((err) => {
//             const error = new ApiError(err.message, err.statusCode)
//             next(error)
//         })
// }

// export const addPermissionsToUser = async (req, res, next) => {
//     const errors = validationResult(req)
//     if (errors.isEmpty()) {
//         const { id } = req.params
//         let { permissions } = req.body
//         permissions = permissions.map(perm => ({
//             permission_name: perm,
//             resource_server_identifier: auth0Vars.apiAudience
//         }))
//         await auth0Management.assignPermissionsToUser({ id }, { permissions })
//             .then(() => {
//                 res.sendStatus(StatusCodes.NO_CONTENT)
//             })
//             .catch((err) => {
//                 const error = new ApiError(err.message, err.statusCode)
//                 next(error)
//             })
//     } else {
//         const error = new ApiError(errors.array(), StatusCodes.UNPROCESSABLE_ENTITY)
//         next(error)
//     }
// }

// export const deleteUserPermissions = async (req, res, next) => {
//     const errors = validationResult(req)
//     if (errors.isEmpty()) {
//         const { id } = req.params
//         let { permissions } = req.body
//         permissions = permissions.map(perm => ({
//             permission_name: perm,
//             resource_server_identifier: auth0Vars.apiAudience
//         }))
//         await auth0Management.removePermissionsFromUser({ id }, { permissions })
//             .then(() => {
//                 res.sendStatus(StatusCodes.NO_CONTENT)
//             })
//             .catch((err) => {
//                 const error = new ApiError(err.message, err.statusCode)
//                 next(error)
//             })
//     } else {
//         const error = new ApiError(errors.array(), StatusCodes.UNPROCESSABLE_ENTITY)
//         next(error)
//     }
// }

// export const readUserRoles = async (req, res, next) => {
//     const { id } = req.params
//     await auth0Management.getUserRoles({ id })
//         .then((roles) => {
//             res.status(StatusCodes.OK).json(response(roles))
//         })
//         .catch((err) => {
//             const error = new ApiError(err.message, err.statusCode)
//             next(error)
//         })
// }

// export const addRolesToUser = async (req, res, next) => {
//     const { id } = req.params
//     const { roles } = req.body
//     await auth0Management.assignRolestoUser({ id }, { roles })
//         .then(() => {
//             res.sendStatus(StatusCodes.NO_CONTENT)
//         })
//         .catch((err) => {
//             const error = new ApiError(err.message, err.statusCode)
//             next(error)
//         })
// }

// export const deleteUserRoles = async (req, res, next) => {
//     const { id } = req.params
//     const { roles } = req.body
//     await auth0Management.removeRolesFromUser({ id }, { roles })
//         .then(() => {
//             res.sendStatus(StatusCodes.NO_CONTENT)
//         })
//         .catch((err) => {
//             const error = new ApiError(err.message, err.statusCode)
//             next(error)
//         })
// }
