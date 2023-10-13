import { validationResult } from "express-validator"
import { StatusCodes } from "http-status-codes"
import products from "../models/product.js"
import orderLines from "../models/order-line.js"
import userReviews from "../models/user-review.js"
import { response } from "../common/utils.js"
import ApiError from "../common/error.js"

export const createProduct = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const { name, description, sku, image, price, category_id, inventory_id } = req.body
        await products.create({
            name,
            description,
            sku,
            image,
            price,
            category_id,
            inventory_id
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

export const readProducts = async (req, res, next) => {
    await products.findAll()
    .then((value) => {
        res.status(StatusCodes.OK).json(response(value))
    })
    .catch((err) => {
        next(err)
    })
}

export const readProduct = async (req, res, next) => {
    const { id } = req.params
    await products.findByPk(id)
    .then((value) => {
        res.status(StatusCodes.OK).json(response(value))
    })
    .catch((err) => {
        next(err)
    })
}

export const updateProduct = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const { id } = req.params
        const { name, description, sku, image, price, category_id, inventory_id } = req.body
        await products.update({
            name,
            description,
            sku,
            image,
            price,
            category_id,
            inventory_id
        }, {
            where: {
                id
            }
        })
        .then((value) => {
            let message
            let statusCode
            if (value > 0) {
                message = "Product updated"
                statusCode = StatusCodes.OK
            } else {
                message = "Product not found"
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

export const deleteProduct = async (req, res, next) => {

}

export const updateProductPromotion = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const { id } = req.params
        const { promotion_id } = req.body
        await products.update({
            promotion_id
        }, {
            where: {
                id
            }
        })
        .then((value) => {
            let message
            let statusCode
            if (value > 0) {
                message = "Product updated"
                statusCode = StatusCodes.OK
            } else {
                message = "Product not found"
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

export const getProductReviews = async (req, res, next) => {
    const { id } = req.params
    await products.findAll({
        include: [{
            model: orderLines,
            required: true,
            attributes: [
                "quantity",
                "total",
                "createdAt"
            ],
            include: [{
                model: userReviews,
                required: true,
                attributes: [
                    "id",
                    "rating",
                    "comment",
                    "pending",
                    "createdAt",
                    "updatedAt"
                ]
            }],
            where: {
                product_id: id
            }
        }],
        attributes: [
            "id",
            "name"
        ]
    })
    .then((value) => {
        res.status(StatusCodes.OK).json(response(value))
    })
    .catch((err) => {
        next(err)
    })
}