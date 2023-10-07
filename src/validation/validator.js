import { body, check } from "express-validator"

export const addPermissionsToUserValidation = [
    body("permissions", "Array with name 'permissions' and min length of one was expected").isArray({ min: 1 }),
    check("permissions.*", "Invalid empty value").notEmpty(),
    check("permissions.*", "String field expected").isString(),
    check("permissions.*", "String does not match permission format").matches("[a-z]:[a-z]")
]

export const deleteUserPermissionsValidation = [
    body("permissions", "Array with name 'permissions' and min length of one was expected").isArray({ min: 1 }),
    check("permissions.*", "Invalid empty value").notEmpty(),
    check("permissions.*", "String field expected").isString(),
    check("permissions.*", "String does not match permission format").matches("[a-z]:[a-z]")
]

export const checkoutValidation = [
    body("items", "Array with name 'items' and min length of one was expected").isArray({ min: 1 }),
    check("items.*", "Invalid empty value").notEmpty(),
    check("items.*", "UUIDv4 field expected").isUUID("4")
]
