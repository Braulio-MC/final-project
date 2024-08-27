import { Router } from 'express'
import { shoppingCartItemsValidation, criteriaValidation, pagingValidation } from '../validation/validator'
import { shoppingCartItemController } from '../di/Container'

const router = Router()

router.post(
  '/cart-items/:cartId',
  shoppingCartItemsValidation.createShoppingCartItem,
  shoppingCartItemController.create.bind(shoppingCartItemController)
)
router.put(
  '/cart-items/:cartId/:itemId',
  shoppingCartItemsValidation.updateShoppingCartItem,
  shoppingCartItemController.update.bind(shoppingCartItemController)
)
router.delete(
  '/cart-items/:cartId/:itemId',
  shoppingCartItemController.delete.bind(shoppingCartItemController)
)
router.get(
  '/cart-items/:cartId/:itemId',
  shoppingCartItemController.findById.bind(shoppingCartItemController)
)
router.get(
  '/cart-items',
  pagingValidation,
  shoppingCartItemController.paging.bind(shoppingCartItemController)
)
router.post(
  '/cart-items/exists/criteria',
  criteriaValidation,
  shoppingCartItemController.existsByCriteria.bind(shoppingCartItemController)
)
router.post(
  '/cart-items/criteria',
  criteriaValidation,
  shoppingCartItemController.pagingByCriteria.bind(shoppingCartItemController)
)

export default router
