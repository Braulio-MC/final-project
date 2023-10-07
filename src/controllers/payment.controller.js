import Stripe from "stripe"
import { validationResult } from "express-validator"
import { UNPROCESSABLE_CONTENT } from "../common/constants.js"
import ApiError from "../common/error.js"
import product from "../models/product.js"

export const checkout = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const { items } = req.body
        const stripe = new Stripe("API KEY")  // Get from configuration file
        let lineItems = items.map(async item => {
            const p = await product.findByPk(item.id)
            return {
                price_date: {
                    currency: "mxn",
                    product_data: {
                        name: p.name
                    },
                    unit_amount: p.price
                },
                quantity: 0  // In cents
            }
        })
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: "",
            cancel_url: ""
        })
    } else {
        const error = new ApiError(UNPROCESSABLE_CONTENT, errors.array(), { name: "Unprocessable Content" })
        next(error)
    }
}