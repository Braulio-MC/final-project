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

export const createStoreValidation = [
    body("name", "Name for store was expected").notEmpty(),
    check("name", "Name for store must be string").isString(),
    body("description", "Description for store was expected").notEmpty(),
    check("description", "Description for store must be text").isString(),
    body("image", "Image for store was expected").notEmpty(),
    check("image", "Image for store must be URL format").isURL(),
    body("user_id", "Owner of store was expected (user ID)").notEmpty(),
    check("user_id", "User ID for store must be string").isString()
]

export const updateStoreValidation = [
    body("name", "New name for store was expected").notEmpty(),
    check("name", "New name for store must be string").isString(),
    body("description", "New description for store was expected").notEmpty(),
    check("description", "New description for store must be text").isString(),
    body("image", "New image for store was expected").notEmpty(),
    check("image", "New image for store must be URL format").isURL(),
    body("user_id", "New owner of store was expected (user ID)").notEmpty(),
    check("user_id", "New user ID for store must be string").isString()
]

export const createProductValidation = [
    body("name", "Name for product was expected").notEmpty(),
    check("name", "Name for product must be string").isString(),
    body("description", "Description for product was expected").notEmpty(),
    check("description", "Description for product must be string").isString(),
    body("sku", "SKU for product was expected").notEmpty(),
    check("sku", "SKU for product must be string").isString(),
    body("image", "Image for product was expected").notEmpty(),
    check("image", "Image for product must be URL format").isURL(),
    body("price", "Price for product was expected").notEmpty(),
    check("price", "Price for product must be float").isFloat(),
    body("category_id", "Category for product was expected").notEmpty(),
    check("category_id", "Category ID for product must be UUIDv4").isUUID(4),
    body("inventory_id", "Inventory for product was expected").notEmpty(),
    check("inventory_id", "Inventory ID for product must be UUIDv4").isUUID(4)
]

export const updateProductValidation = [
    body("name", "Name for product was expected").notEmpty(),
    check("name", "Name for product must be string").isString(),
    body("description", "Description for product was expected").notEmpty(),
    check("description", "Description for product must be string").isString(),
    body("sku", "SKU for product was expected").notEmpty(),
    check("sku", "SKU for product must be string").isString(),
    body("image", "Image for product was expected").notEmpty(),
    check("image", "Image for product must be URL format").isURL(),
    body("price", "Price for product was expected").notEmpty(),
    check("price", "Price for product must be float").isFloat(),
    body("category_id", "Category for product was expected").notEmpty(),
    check("category_id", "Category ID for product must be UUIDv4").isUUID(4),
    body("inventory_id", "Inventory for product was expected").notEmpty(),
    check("inventory_id", "Inventory ID for product must be UUIDv4").isUUID(4)
]

export const updateProductPromotionValidation = [
    body("promotion_id", "Promotion ID for product was expected").notEmpty(),
    check("promotion_id", "Promotion ID for product must be UUIDv4").isUUID(4)
]

export const createCountryValidation = [
    body("country_code", "Country code was expected").notEmpty(),
    check("country_code", "Country code must be ISO 3166-1 Alpha-3").isISO31661Alpha3(), 
    body("country_name", "Country name was expected").notEmpty(),
    check("country_name", "Country name must be string").isString()
]

export const updateCountryValidation = [
    body("country_code", "Country code was expected").notEmpty(),
    check("country_code", "Country code must be ISO 3166-1 Alpha-3").isISO31661Alpha3(), 
    body("country_name", "Country name was expected").notEmpty(),
    check("country_name", "Country name must be string").isString()
]