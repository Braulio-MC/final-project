import { Router } from 'express'
import { cartsValidation, criteriaValidation, pagingValidation } from '../validation/validator'
import { shoppingCartController } from '../di/Container'

const router = Router()

router.post(
  '/cart',
  cartsValidation.createCart,
  shoppingCartController.create.bind(shoppingCartController)
)
router.put(
  '/cart/:id',
  cartsValidation.updateCart,
  shoppingCartController.update.bind(shoppingCartController)
)
router.delete(
  '/cart/:id',
  shoppingCartController.delete.bind(shoppingCartController)
)
router.get(
  '/cart/:id',
  shoppingCartController.findById.bind(shoppingCartController)
)
router.get(
  '/cart',
  pagingValidation,
  shoppingCartController.paging.bind(shoppingCartController)
)
router.post(
  '/cart/criteria',
  criteriaValidation,
  shoppingCartController.pagingByCriteria.bind(shoppingCartController)
)

export default router
