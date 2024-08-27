import { Router } from 'express'
import { criteriaValidation, ordersValidation, pagingValidation } from '../validation/validator'
import { orderController } from '../di/Container'

const router = Router()

router.post(
  '/orders',
  ordersValidation.createOrder,
  orderController.create.bind(orderController)
)
router.put(
  '/orders/:id',
  ordersValidation.updateOrder,
  orderController.update.bind(orderController)
)
// router.delete(
//   '/orders/:id',
//   orderController.delete.bind(orderController)
// )
router.get(
  '/orders/:id',
  orderController.findById.bind(orderController)
)
router.get(
  '/orders',
  pagingValidation,
  orderController.paging.bind(orderController)
)
router.post(
  '/orders/exists/criteria',
  criteriaValidation,
  orderController.existsByCriteria.bind(orderController)
)
router.post(
  '/orders/criteria',
  criteriaValidation,
  orderController.pagingByCriteria.bind(orderController)
)

export default router
