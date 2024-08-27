import { Router } from 'express'
// import {
//   checkAccessToken,
//   checkRequiredPermissions
// } from '../middleware/auth0.middleware'
import { criteriaValidation, pagingValidation, productFavoritesValidation } from '../validation/validator'
import { productFavoriteController } from '../di/Container'

const router = Router()

router.post(
  '/product-favorites',
  productFavoritesValidation.createProductFavorite,
  productFavoriteController.create.bind(productFavoriteController)
)
router.put(
  '/product-favorites/:id',
  productFavoritesValidation.updateProductFavorite,
  productFavoriteController.update.bind(productFavoriteController)
)
router.delete(
  '/product-favorites/:id',
  productFavoriteController.delete.bind(productFavoriteController)
)
router.get(
  '/product-favorites/:id',
  productFavoriteController.findById.bind(productFavoriteController)
)
router.get(
  '/product-favorites',
  pagingValidation,
  productFavoriteController.paging.bind(productFavoriteController)
)
router.post(
  '/product-favorites/exists/criteria',
  criteriaValidation,
  productFavoriteController.existsByCriteria.bind(productFavoriteController)
)
router.post(
  '/product-favorites/criteria',
  criteriaValidation,
  productFavoriteController.pagingByCriteria.bind(productFavoriteController)
)

export default router
