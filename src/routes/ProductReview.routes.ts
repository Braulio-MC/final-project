import { Router } from 'express'
// import {
//   checkAccessToken,
//   checkRequiredPermissions
// } from '../middleware/auth0.middleware'
import { criteriaValidation, pagingValidation, productReviewsValidation } from '../validation/validator'
import { productReviewController } from '../di/Container'

const router = Router()

router.post(
  '/product-reviews',
  productReviewsValidation.createProductReview,
  productReviewController.create.bind(productReviewController)
)
router.put(
  '/product-reviews/:id',
  productReviewsValidation.updateProductReview,
  productReviewController.update.bind(productReviewController)
)
router.delete(
  '/product-reviews/:id',
  productReviewController.delete.bind(productReviewController)
)
router.get(
  '/product-reviews/:id',
  productReviewController.findById.bind(productReviewController)
)
router.get(
  '/product-reviews',
  pagingValidation,
  productReviewController.paging.bind(productReviewController)
)

router.post(
  '/product-reviews/criteria',
  criteriaValidation,
  productReviewController.pagingByCriteria.bind(productReviewController)
)

export default router
