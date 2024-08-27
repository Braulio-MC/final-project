import { Router } from 'express'
// import {
//   checkAccessToken,
//   checkRequiredPermissions
// } from '../middleware/auth0.middleware'
import { criteriaValidation, pagingValidation, storeReviewsValidation } from '../validation/validator'
import { storeReviewController } from '../di/Container'

const router = Router()

router.post(
  '/store-reviews',
  storeReviewsValidation.createStoreReview,
  storeReviewController.create.bind(storeReviewController)
)
router.put(
  '/store-reviews/:id',
  storeReviewsValidation.updateStoreReview,
  storeReviewController.update.bind(storeReviewController)
)
router.delete(
  '/store-reviews/:id',
  storeReviewController.delete.bind(storeReviewController)
)
router.get(
  '/store-reviews/:id',
  storeReviewController.findById.bind(storeReviewController)
)
router.get(
  '/store-reviews',
  pagingValidation,
  storeReviewController.paging.bind(storeReviewController)
)
router.post(
  '/store-reviews/exists/criteria',
  criteriaValidation,
  storeReviewController.existsByCriteria.bind(storeReviewController)
)
router.post(
  '/store-reviews/criteria',
  criteriaValidation,
  storeReviewController.pagingByCriteria.bind(storeReviewController)
)

export default router
