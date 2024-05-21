import { Router } from 'express'
import { criteriaValidation, discountsValidation, pagingValidation } from '../validation/validator'
import { discountController } from '../di/Container'

const router = Router()

router.post(
  '/discounts',
  discountsValidation.createDiscount,
  discountController.create.bind(discountController)
)
router.put(
  '/discounts/:id',
  discountsValidation.updateDiscount,
  discountController.update.bind(discountController)
)
router.delete(
  '/discounts/:id',
  discountController.delete.bind(discountController)
)
router.get(
  '/discounts/:id',
  discountController.findById.bind(discountController)
)
router.get(
  '/discounts',
  pagingValidation,
  discountController.paging.bind(discountController)
)
router.post(
  '/discounts/criteria',
  criteriaValidation,
  discountController.pagingByCriteria.bind(discountController)
)

export default router
