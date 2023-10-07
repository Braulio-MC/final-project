import auth0Management from "../common/auth0.js"
import { auth0Vars } from "../config/configuration.js"
import { response } from "../common/utils.js"
import { OK, NO_CONTENT } from "../common/constants.js"
import ApiError from "../common/error.js"

/**
 * @description receives name and description as req.body
 */
export const createRole = async (req, res, next) => {
    const { name, description } = req.body
    await auth0Management.createRole({ name, description })
    .then((role) => {
        res.status(OK).json(response(OK, role))
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

export const readRoles = async (req, res, next) => {
    await auth0Management.getRoles()
    .then((roles) => {
        res.status(OK).json(response(OK, roles))
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

/**
 * @description receives id as req.params
 */
export const readRole = async (req, res, next) => {
    const { id } = req.params
    await auth0Management.getRole({ id })
    .then((role) => {
        res.status(OK).json(response(OK, role))
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

/**
 * @description receives name and description as req.body and id as req.params
 */
export const updateRole = async (req, res, next) => {
    const { id } = req.params
    const { name, description } = req.body
    await auth0Management.updateRole({ id }, { name, description })
    .then((role) => {
        res.status(OK).json(response(OK, role))
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

/**
 * @description receives id as req.params
 */
export const deleteRole = async (req, res, next) => {
    const { id } = req.params
    await auth0Management.deleteRole({ id })
    .then(() => {
        res.sendStatus(NO_CONTENT)
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

/**
 * @description receives an array of permission names as req.body and id as req.params
 * @todo validate permissions
 */
export const addPermissionsToRole = async (req, res, next) => {
    const { id } = req.params
    let { permissions } = req.body
    permissions = permissions.map(perm => ({
        permission_name: perm, 
        resource_server_identifier: auth0Vars.apiAudience
    }))
    await auth0Management.addPermissionsInRole({ id }, { permissions })
    .then(() => {
        res.sendStatus(NO_CONTENT)
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

/**
 * @description receives id as req.params
 */
export const readRolePermissions = async (req, res, next) => {
    const { id } = req.params
    await auth0Management.getPermissionsInRole({ id })
    .then((permissions) => {
        res.status(OK).json(response(OK, permissions))
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

/**
 * @description receives an array of permission names as req.body and id as req.params
 * @todo validate permissions
 */
export const deleteRolePermissions = async (req, res, next) => {
    const { id } = req.params
    let { permissions } = req.body
    permissions = permissions.map(perm => ({
        permission_name: perm, 
        resource_server_identifier: auth0Vars.apiAudience
    }))
    await auth0Management.removePermissionsFromRole({ id }, { permissions })
    .then(() => {
        res.sendStatus(NO_CONTENT)
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

/**
 * @description receives id as req.params
 */
export const readRoleUsers = async (req, res, next) => {
    const { id } = req.params
    await auth0Management.getUsersInRole({ id })
    .then((users) => {
        res.status(OK).json(response(OK, users))
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}