import { Router } from 'express'
// import {
//   checkAccessToken,
//   checkRequiredPermissions
// } from '../middleware/auth0.middleware'
import { criteriaValidation, pagingValidation, storeFavoritesValidation } from '../validation/validator'
import { storeFavoriteController } from '../di/Container'

const router = Router()

router.post(
  '/store-favorites',
  storeFavoritesValidation.createStoreFavorite,
  storeFavoriteController.create.bind(storeFavoriteController)
)
router.put(
  '/store-favorites/:id',
  storeFavoritesValidation.updateStoreFavorite,
  storeFavoriteController.update.bind(storeFavoriteController)
)
router.delete(
  '/store-favorites/:id',
  storeFavoriteController.delete.bind(storeFavoriteController)
)
router.get(
  '/store-favorites/:id',
  storeFavoriteController.findById.bind(storeFavoriteController)
)
router.get(
  '/store-favorites',
  pagingValidation,
  storeFavoriteController.paging.bind(storeFavoriteController)
)
router.post(
  '/store-favorites/exists/criteria',
  criteriaValidation,
  storeFavoriteController.existsByCriteria.bind(storeFavoriteController)
)
router.post(
  '/store-favorites/criteria',
  criteriaValidation,
  storeFavoriteController.pagingByCriteria.bind(storeFavoriteController)
)

export default router
