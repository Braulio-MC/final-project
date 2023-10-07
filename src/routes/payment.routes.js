import { Router } from "express"
import { checkoutValidation } from "../validation/validator.js"
import { checkout } from "../controllers/payment.controller.js"

const router = Router()

router.post("/checkout", checkoutValidation, checkout)

export default router