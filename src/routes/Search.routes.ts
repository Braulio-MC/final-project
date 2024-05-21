import { Router } from 'express'
import { searchValidation } from '../validation/validator'
import { searchController } from '../di/Container'

const router = Router()

router.get(
  '/search',
  searchValidation,
  searchController.search.bind(searchController)
)

export default router
