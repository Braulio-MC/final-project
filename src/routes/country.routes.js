import { Router } from "express"
import { 
    createCountryValidation,
    updateCountryValidation
} from "../validation/validator.js"
import {
    createCountry,
    readCountries,
    readCountry,
    updateCountry,
    deleteCountry,
    getCountryAddresses
} from "../controllers/country.controller.js"

const router = Router()

router.post("/countries", createCountryValidation, createCountry)
router.get("/countries", readCountries)
router.get("/countries/:id", readCountry)
router.put("/countries/:id", updateCountryValidation, updateCountry)
router.delete("/countries/:id", deleteCountry)
router.get("/countries/:id/addresses", getCountryAddresses)

export default router