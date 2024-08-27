import { Router } from 'express'
// import {
//   checkAccessToken,
//   checkRequiredPermissions
// } from '../middleware/auth0.middleware'
import { criteriaValidation, pagingValidation, storesValidation } from '../validation/validator'
import { storeController } from '../di/Container'
import { multerUpload } from '../core/MulterHelper'
const router = Router()

router.post(
  '/stores',
  multerUpload.single('image'),
  storesValidation.createStore,
  storeController.create.bind(storeController)
)
router.put(
  '/stores/:id',
  multerUpload.single('image'),
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
  '/stores/exists/criteria',
  criteriaValidation,
  storeController.existsByCriteria.bind(storeController)
)
router.post(
  '/stores/criteria',
  criteriaValidation,
  storeController.pagingByCriteria.bind(storeController)
)

export default router
