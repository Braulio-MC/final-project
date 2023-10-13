import { Router } from "express"
import {
    checkAccessToken,
    checkRequiredPermissions
} from "../middleware/auth0.middleware.js"
import {
    createStoreValidation,
    updateStoreValidation
} from "../validation/validator.js"
import {
    createStore,
    readStores,
    readStore,
    updateStore,
    deleteStore,
    getStoreProducts,
    getStorePromotions,
    getStoreLocations,
    getStoreOrders
} from "../controllers/store.controller.js"

const router = Router()

router.post("/stores", createStoreValidation, createStore)
router.get("/stores", readStores)
router.get("/stores/:id", readStore)
router.put("/stores/:id", updateStoreValidation, updateStore)
router.delete("/stores/:id", deleteStore)
router.get("/stores/:id/products", getStoreProducts)
router.get("/stores/:id/promotions", getStorePromotions)
router.get("/stores/:id/locations", getStoreLocations)
router.get("/stores/:id/orders", getStoreOrders)

export default router