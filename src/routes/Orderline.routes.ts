import { Router } from 'express'
import { orderlinesValidation, criteriaValidation, pagingValidation } from '../validation/validator'
import { orderlineController } from '../di/Container'

const router = Router()

router.post(
  '/order-lines/:orderId',
  orderlinesValidation.createOrderline,
  orderlineController.create.bind(orderlineController)
)
router.put(
  '/order-lines/:orderId/:lineId',
  orderlinesValidation.updateOrderline,
  orderlineController.update.bind(orderlineController)
)
router.delete(
  '/order-lines/:orderId/:lineId',
  orderlineController.delete.bind(orderlineController)
)
router.get(
  '/order-lines/:orderId/:lineId',
  orderlineController.findById.bind(orderlineController)
)
router.get(
  '/order-lines',
  pagingValidation,
  orderlineController.paging.bind(orderlineController)
)
router.post(
  '/order-lines/exists/criteria',
  criteriaValidation,
  orderlineController.existsByCriteria.bind(orderlineController)
)
router.post(
  '/order-lines/criteria',
  criteriaValidation,
  orderlineController.pagingByCriteria.bind(orderlineController)
)

export default router
