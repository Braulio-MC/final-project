import { Router } from 'express'
import { criteriaValidation, pagingValidation, paymentsValidation } from '../validation/validator'
import { paymentController } from '../di/Container'

const router = Router()

// router.post('/payment/checkout', paymentsValidation.checkout, checkout)
router.post(
  '/payment',
  paymentsValidation.createType,
  paymentController.create.bind(paymentController)
)
router.put(
  '/payment/:id',
  paymentsValidation.updateType,
  paymentController.update.bind(paymentController)
)
router.delete(
  '/payment/:id',
  paymentController.delete.bind(paymentController)
)
router.get(
  '/payment/:id',
  paymentController.findById.bind(paymentController)
)
router.get(
  '/payment',
  pagingValidation,
  paymentController.paging.bind(paymentController)
)
router.post(
  '/payment/exists/criteria',
  criteriaValidation,
  paymentController.existsByCriteria.bind(paymentController)
)
router.post(
  '/payment/criteria',
  criteriaValidation,
  paymentController.pagingByCriteria.bind(paymentController)
)

export default router
