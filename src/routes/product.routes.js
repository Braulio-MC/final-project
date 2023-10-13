import { Router } from "express"
import {
    checkAccessToken,
    checkRequiredPermissions
} from "../middleware/auth0.middleware.js"
import {
    createProductValidation,
    updateProductValidation,
    updateProductPromotionValidation
} from "../validation/validator.js"
import {
    createProduct,
    readProducts,
    readProduct,
    updateProduct,
    deleteProduct,
    updateProductPromotion,
    getProductReviews
} from "../controllers/product.controller.js"

const router = Router()

router.post("/products", createProductValidation, createProduct)
router.get("/products", readProducts)
router.get("/products/:id", readProduct)
router.put("/products/:id", updateProductValidation, updateProduct)
router.delete("/products/:id", deleteProduct)
router.put("/products/:id/promotions", updateProductPromotionValidation, updateProductPromotion)
router.get("/products/:id/reviews", getProductReviews)

export default router