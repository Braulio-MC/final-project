import { validationResult } from "express-validator"
import auth0Management from "../common/auth0.js"
import { auth0Vars } from "../config/configuration.js"
import users from "../models/user.js"
import ApiError from "../common/error.js"
import { response } from "../common/utils.js"

// TODO update HTTP status codes

export const createUser = async (req, res, next) => {
    const { 
        app_metadata,
        email,
        given_name,
        password,
        picture,
        username,
        blocked,
        email_verified,
        name,
        phone_number,
        user_id,
        user_metadata,
        verify_email,
        family_name,
        nickname,
        phone_verified,
        connection
    } = req.body
    await auth0Management.createUser({ 
        app_metadata,
        email,
        given_name,
        password,
        picture,
        username,
        blocked,
        email_verified,
        name,
        phone_number,
        user_id,
        user_metadata,
        verify_email,
        family_name,
        nickname,
        phone_verified,
        connection 
    })
    .then((user) => {
        res.status(OK).json(response(OK, user))
        users.create({ id: user_id })
    })
    .catch((err) => {
        const error = new ApiError(err.message, err.statusCode)
        next(error)
    })
}

export const readUsers = async (req, res, next) => {
    await auth0Management.getUsers()
    .then(async (users) => {
        await res.status(OK).json(response(OK, users))
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

export const readUser = async (req, res, next) => {
    const { id } = req.params
    await auth0Management.getUser({ id })
    .then((user) => {
        res.status(OK).json(response(OK, user))
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

export const updateUser = async (req, res, next) => {
    const { id } = req.params
    const {
        app_metadata,
        email,
        given_name,
        password,
        picture,
        username,
        blocked,
        email_verified,
        name,
        phone_number,
        user_id,
        user_metadata,
        verify_email,
        family_name,
        nickname,
        phone_verified,
        connection
    } = req.body
    await auth0Management.updateUser({ id }, {
        app_metadata,
        email,
        given_name,
        password,
        picture,
        username,
        blocked,
        email_verified,
        name,
        phone_number,
        user_id,
        user_metadata,
        verify_email,
        family_name,
        nickname,
        phone_verified,
        connection
    })
    .then((user) => {
        res.status(OK).json(response(OK, user))
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

export const deleteUser = async (req, res, next) => {
    const { id } = req.params
    await auth0Management.deleteUser({ id })
    .then(() => {
        res.sendStatus(NO_CONTENT)
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

export const readUserPermissions = async (req, res, next) => {
    const { id } = req.params
    await auth0Management.getUserPermissions({ id })
    .then((permissions) => {
        res.status(OK).json(response(OK, permissions))
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

export const addPermissionsToUser = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const { id } = req.params
        let { permissions } = req.body
        permissions = permissions.map(perm => ({
            permission_name: perm, 
            resource_server_identifier: auth0Vars.apiAudience  // Possible error if empty
        }))
        await auth0Management.assignPermissionsToUser({ id }, { permissions })
        .then(() => {
            res.sendStatus(NO_CONTENT)
        })
        .catch((err) => {
            const error = new ApiError(err.statusCode, err.message, { name: err.name })
            next(error)
        })
    } else {
        const error = new ApiError(UNPROCESSABLE_CONTENT, errors.array(), { name: "Unprocessable Content" })
        next(error)
    }
}

export const deleteUserPermissions = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const { id } = req.params
        let { permissions } = req.body
        permissions = permissions.map(perm => ({
            permission_name: perm, 
            resource_server_identifier: auth0Vars.apiAudience  // Error if empty
        }))
        await auth0Management.removePermissionsFromUser({ id }, { permissions })
        .then(() => {
            res.sendStatus(NO_CONTENT)
        })
        .catch((err) => {
            const error = new ApiError(err.statusCode, err.message, { name: err.name })
            next(error)
        })
    } else {
        const error = new ApiError(UNPROCESSABLE_CONTENT, errors.array(), { name: "Unprocessable Content" })
        next(error)
    }
}

export const readUserRoles = async (req, res, next) => {
    const { id } = req.params
    await auth0Management.getUserRoles({ id })
    .then((roles) => {
        res.status(OK).json(response(OK, roles))
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

export const addRolesToUser = async (req, res, next) => {
    const { id } = req.params
    const { roles } = req.body
    await auth0Management.assignRolestoUser({ id }, { roles })
    .then(() => {
        res.sendStatus(NO_CONTENT)
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}

export const deleteUserRoles = async (req, res, next) => {
    const { id } = req.params
    const { roles } = req.body
    await auth0Management.removeRolesFromUser({ id }, { roles })
    .then(() => {
        res.sendStatus(NO_CONTENT)
    })
    .catch((err) => {
        const error = new ApiError(err.statusCode, err.message, { name: err.name })
        next(error)
    })
}