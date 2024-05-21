import { Router } from 'express'
// import {
//   checkAccessToken,
//   checkRequiredPermissions
// } from '../middleware/auth0.middleware'
import { criteriaValidation, pagingValidation, productsValidation, searchValidation } from '../validation/validator'
import { productController } from '../di/Container'

const router = Router()

router.post(
  '/products',
  productsValidation.createProduct,
  productController.create.bind(productController)
)
router.put(
  '/products/:id',
  productsValidation.updateProduct,
  productController.update.bind(productController)
)
router.delete(
  '/products/:id',
  productController.delete.bind(productController)
)
router.get(
  '/products/:id',
  productController.findById.bind(productController)
)
router.get(
  '/products',
  pagingValidation,
  productController.paging.bind(productController)
)
router.post(
  '/products/criteria',
  criteriaValidation,
  productController.pagingByCriteria.bind(productController)
)
router.get(
  '/products/search',
  searchValidation,
  productController.search.bind(productController)
)

export default router
