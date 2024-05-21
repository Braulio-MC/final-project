import { Router } from 'express'
// import {
//   checkAccessToken,
//   checkRequiredPermissions
// } from '../middleware/auth0.middleware'
import { criteriaValidation, pagingValidation, searchValidation, storesValidation } from '../validation/validator'
import { storeController } from '../di/Container'
const router = Router()

router.post(
  '/stores',
  storesValidation.createStore,
  storeController.create.bind(storeController)
)
router.put(
  '/stores/:id',
  storesValidation.updateStore,
  storeController.update.bind(storeController)
)
router.delete(
  '/stores/:id',
  storeController.delete.bind(storeController)
)
router.get(
  '/stores/:id',
  storeController.findById.bind(storeController)
)
router.get(
  '/stores',
  pagingValidation,
  storeController.paging.bind(storeController)
)
router.post(
  '/stores/criteria',
  criteriaValidation,
  storeController.pagingByCriteria.bind(storeController)
)
router.get(
  '/stores/search',
  searchValidation,
  storeController.search.bind(storeController)
)

export default router
