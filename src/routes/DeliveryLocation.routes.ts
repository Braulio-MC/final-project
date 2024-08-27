import { Router } from 'express'
import { criteriaValidation, deliveryLocationsValidation, pagingValidation } from '../validation/validator'
import { deliveryLocationController } from '../di/Container'

const router = Router()

router.post(
  '/delivery-locations',
  deliveryLocationsValidation.createLocation,
  deliveryLocationController.create.bind(deliveryLocationController)
)
router.put(
  '/delivery-locations/:id',
  deliveryLocationsValidation.updateLocation,
  deliveryLocationController.update.bind(deliveryLocationController)
)
router.delete(
  '/delivery-locations/:id',
  deliveryLocationController.delete.bind(deliveryLocationController)
)
router.get(
  '/delivery-locations/:id',
  deliveryLocationController.findById.bind(deliveryLocationController)
)
router.get(
  '/delivery-locations',
  pagingValidation,
  deliveryLocationController.paging.bind(deliveryLocationController)
)
router.post(
  '/delivery-locations/exists/criteria',
  criteriaValidation,
  deliveryLocationController.existsByCriteria.bind(deliveryLocationController)
)
router.post(
  '/delivery-locations/criteria',
  criteriaValidation,
  deliveryLocationController.pagingByCriteria.bind(deliveryLocationController)
)

export default router
