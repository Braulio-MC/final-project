import { validationResult } from "express-validator"
import { StatusCodes } from "http-status-codes"
import stores from "../models/store.js"
import productInventories from "../models/product-inventory.js"
import products from "../models/product.js"
import promotions from "../models/promotion.js"
import deliveryLocations from "../models/delivery-location.js"
import orderDetails from "../models/order-details.js"
import orderStatuses from "../models/order-status.js"
import users from "../models/user.js"
import userPaymentMethods from "../models/user-payment-method.js"
import paymentTypes from "../models/payment-type.js"
import ApiError from "../common/error.js"
import { response } from "../common/utils.js"

/**
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @description receives name, description, image url and user_id as req.body
 */
export const createStore = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const { name, description, image, user_id } = req.body
        await stores.create({
            name,
            description,
            image,
            user_id
        })
        .then((value) => {
            res.status(StatusCodes.OK).json(response(value))
        })
        .catch((err) => {
            next(err)
        })
    } else {
        const error = new ApiError(errors.array(), StatusCodes.UNPROCESSABLE_ENTITY)
        next(error)
    } 
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const readStores = async (req, res, next) => {
    await stores.findAll()
    .then((value) => {
        res.status(StatusCodes.OK).json(response(value))
    })
    .catch((err) => {
        next(err)
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const readStore = async (req, res, next) => {
    const { id } = req.params
    await stores.findByPk(id)
    .then((value) => {
        res.status(StatusCodes.OK).json(response(value))
    })
    .catch((err) => {
        next(err)
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const updateStore = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const { id } = req.params
        const { name, description, image, user_id } = req.body
        await stores.update({
            name,
            description,
            image,
            user_id
        }, {
            where: {
                id
            }
        })
        .then((value) => {
            let message
            let statusCode
            if (value > 0) {
                message = "Store updated"
                statusCode = StatusCodes.OK
            } else {
                message = "Store not found"
                statusCode = StatusCodes.NOT_FOUND
            }
            res.status(statusCode).json(response(message, statusCode))
        })
        .catch((err) => {
            next(err)
        })
    } else {
        const error = new ApiError(errors.array(), StatusCodes.UNPROCESSABLE_ENTITY)
        next(error)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const deleteStore = async (req, res, next) => {

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const getStoreProducts = async (req, res, next) => {
    const { id } = req.params
    await stores.findAll({
        include: [{
            model: productInventories,
            required: true,
            attributes: [
                "id",
                "quantity"
            ],
            include: [{
                model: products,
                required: true,
                attributes: [
                    "id",
                    "name",
                    "description",
                    "sku",
                    "image",
                    "price",
                    "createdAt",
                    "updatedAt"
                ]
            }],
            where: {
                store_id: id
            }
        }],
        attributes: []
    })
    .then((value) => {
        res.status(StatusCodes.OK).json(response(value))
    })
    .catch((err) => {
        next(err)
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const getStorePromotions = async (req, res, next) => {
    const { id } = req.params
    await stores.findAll({
        include: [{
            model: promotions,
            required: true,
            attributes: [
                "id",
                "name",
                "description",
                "discount_rate",
                "active",
                "start_date",
                "end_date",
                "createdAt",
                "updatedAt"
            ],
            where: {
                store_id: id
            }
        }],
        attributes: []
    })
    .then((value) => {
        res.status(StatusCodes.OK).json(response(value))
    })
    .catch((err) => {
        next(err)
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const getStoreLocations = async (req, res, next) => {
    const { id } = req.params
    await stores.findAll({
        include: [{
            model: deliveryLocations,
            required: true,
            attributes: [
                "id",
                "name",
                "description",
                "is_default",
                "createdAt",
                "updatedAt"
            ],
            where: {
                store_id: id
            }
        }],
        attributes: []
    })
    .then((value) => {
        res.status(StatusCodes.OK).json(response(value))
    })
    .catch((err) => {
        next(err)
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const getStoreOrders = async (req, res, next) => {
    const { id } = req.params
    await stores.findAll({
        include: [{
            model: orderDetails,
            required: true,
            attributes: [
                "id",
                "order_date",
                "total",
                "updatedAt"
            ],
            include: [{
                model: orderStatuses,
                required: true,
                attributes: [
                    "id",
                    "status"
                ]
            }, {
                model: users,
                required: true,
                attributes: [
                    "id"
                ]
            }, {
                model: userPaymentMethods,
                required: true,
                attributes: [
                    "id",
                    "provider"
                ],
                include: [{
                    model: paymentTypes,
                    required: true,
                    attributes: [
                        "id",
                        "name"
                    ]
                }]
            }, {
                model: deliveryLocations,
                required: true,
                attributes: [
                    "id",
                    "name",
                    "description"
                ]
            }],
            where: {
                store_id: id
            }
        }],
        attributes: []
    })
    .then((value) => {
        res.status(StatusCodes.OK).json(response(value))
    })
    .catch((err) => {
        next(err)
    })
}