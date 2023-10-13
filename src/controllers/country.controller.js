import { validationResult } from "express-validator"
import { StatusCodes } from "http-status-codes"
import countries from "../models/country.js"
import addresses from "../models/address.js"
import { response } from "../common/utils.js"
import ApiError from "../common/error.js"

export const createCountry = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        let { country_code, country_name } = req.body
        country_code = country_code.toUpperCase()
        await countries.create({
            country_code,
            country_name
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

export const readCountries = async (req, res, next) => {
    await countries.findAll()
    .then((value) => {
        res.status(StatusCodes.OK).json(response(value))
    })
    .catch((err) => {
        next(err)
    })
}

export const readCountry = async (req, res, next) => {
    const { id } = req.params
    await countries.findByPk(id)
    .then((value) => {
        res.status(StatusCodes.OK).json(response(value))
    })
    .catch((err) => {
        next(err)
    })
}

export const updateCountry = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const { id } = req.params
        let { country_code, country_name } = req.body
        country_code = country_code.toUpperCase()
        await countries.update({
            country_code,
            country_name
        }, {
            where: {
                id
            }
        })
        .then((value) => {
            let message
            let statusCode
            if (value > 0) {
                message = "Country updated"
                statusCode = StatusCodes.OK
            } else {
                message = "Country not found"
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

export const deleteCountry = async (req, res, next) => {

}

export const getCountryAddresses = async (req, res, next) => {
    const { id } = req.params
    await countries.findAll({
        include: [{
            model: addresses,
            required: true,
            attributes: [
                "id",
                "city",
                "region",
                "postal_code"
            ],
            where: {
                country_id: id
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