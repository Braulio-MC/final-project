// import auth0Management from "../core/auth0.js"
// import { auth0Vars } from "../core/configuration.js"
// import { response } from "../core/utils.js"
// import ApiError from "../core/error.js"
// import { StatusCodes } from "http-status-codes"

// /**
//  * @description receives name and description as req.body
//  */
// export const createRole = async (req, res, next) => {
//     const { name, description } = req.body
//     await auth0Management.createRole({ name, description })
//     .then((role) => {
//         res.status(StatusCodes.OK).json(response(role))
//     })
//     .catch((err) => {
//         const error = new ApiError(err.statusCode, err.message, { name: err.name })
//         next(error)
//     })
// }

// export const readRoles = async (req, res, next) => {
//     await auth0Management.getRoles()
//     .then((roles) => {
//         res.status(StatusCodes.OK).json(response(roles))
//     })
//     .catch((err) => {
//         const error = new ApiError(err.statusCode, err.message, { name: err.name })
//         next(error)
//     })
// }

// /**
//  * @description receives id as req.params
//  */
// export const readRole = async (req, res, next) => {
//     const { id } = req.params
//     await auth0Management.getRole({ id })
//     .then((role) => {
//         res.status(StatusCodes.OK).json(response(role))
//     })
//     .catch((err) => {
//         const error = new ApiError(err.statusCode, err.message, { name: err.name })
//         next(error)
//     })
// }

// /**
//  * @description receives name and description as req.body and id as req.params
//  */
// export const updateRole = async (req, res, next) => {
//     const { id } = req.params
//     const { name, description } = req.body
//     await auth0Management.updateRole({ id }, { name, description })
//     .then((role) => {
//         res.status(StatusCodes.OK).json(response(role))
//     })
//     .catch((err) => {
//         const error = new ApiError(err.statusCode, err.message, { name: err.name })
//         next(error)
//     })
// }

// /**
//  * @description receives id as req.params
//  */
// export const deleteRole = async (req, res, next) => {
//     const { id } = req.params
//     await auth0Management.deleteRole({ id })
//     .then(() => {
//         res.sendStatus(StatusCodes.NO_CONTENT)
//     })
//     .catch((err) => {
//         const error = new ApiError(err.statusCode, err.message, { name: err.name })
//         next(error)
//     })
// }

// /**
//  * @description receives an array of permission names as req.body and id as req.params
//  * @todo validate permissions
//  */
// export const addPermissionsToRole = async (req, res, next) => {
//     const { id } = req.params
//     let { permissions } = req.body
//     permissions = permissions.map(perm => ({
//         permission_name: perm,
//         resource_server_identifier: auth0Vars.apiAudience
//     }))
//     await auth0Management.addPermissionsInRole({ id }, { permissions })
//     .then(() => {
//         res.sendStatus(StatusCodes.NO_CONTENT)
//     })
//     .catch((err) => {
//         const error = new ApiError(err.statusCode, err.message, { name: err.name })
//         next(error)
//     })
// }

// /**
//  * @description receives id as req.params
//  */
// export const readRolePermissions = async (req, res, next) => {
//     const { id } = req.params
//     await auth0Management.getPermissionsInRole({ id })
//     .then((permissions) => {
//         res.status(StatusCodes.OK).json(response(permissions))
//     })
//     .catch((err) => {
//         const error = new ApiError(err.statusCode, err.message, { name: err.name })
//         next(error)
//     })
// }

// /**
//  * @description receives an array of permission names as req.body and id as req.params
//  * @todo validate permissions
//  */
// export const deleteRolePermissions = async (req, res, next) => {
//     const { id } = req.params
//     let { permissions } = req.body
//     permissions = permissions.map(perm => ({
//         permission_name: perm,
//         resource_server_identifier: auth0Vars.apiAudience
//     }))
//     await auth0Management.removePermissionsFromRole({ id }, { permissions })
//     .then(() => {
//         res.sendStatus(StatusCodes.NO_CONTENT)
//     })
//     .catch((err) => {
//         const error = new ApiError(err.statusCode, err.message, { name: err.name })
//         next(error)
//     })
// }

// /**
//  * @description receives id as req.params
//  */
// export const readRoleUsers = async (req, res, next) => {
//     const { id } = req.params
//     await auth0Management.getUsersInRole({ id })
//     .then((users) => {
//         res.status(StatusCodes.OK).json(response(users))
//     })
//     .catch((err) => {
//         const error = new ApiError(err.statusCode, err.message, { name: err.name })
//         next(error)
//     })
// }
