import { Router } from 'express'
// import {
//   checkAccessToken,
//   checkRequiredPermissions
// } from '../middleware/auth0.middleware'
import { criteriaValidation, pagingValidation, productsValidation } from '../validation/validator'
import { productController } from '../di/Container'
import { multerUpload } from '../core/MulterHelper'

const router = Router()

router.post(
  '/products',
  productsValidation.createProduct,
  multerUpload.single('image'),
  productController.create.bind(productController)
)
router.put(
  '/products/:id',
  productsValidation.updateProduct,
  multerUpload.single('image'),
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
  '/products/exists/criteria',
  criteriaValidation,
  productController.existsByCriteria.bind(productController)
)
router.post(
  '/products/criteria',
  criteriaValidation,
  productController.pagingByCriteria.bind(productController)
)

export default router
