import { Router } from 'express'
import { categoriesValidation, criteriaValidation, pagingValidation } from '../validation/validator'
import { categoryController } from '../di/Container'

const router = Router()

router.post(
  '/categories',
  categoriesValidation.createCategory,
  categoryController.create.bind(categoryController)
)
router.put(
  '/categories/:id',
  categoriesValidation.updateCategory,
  categoryController.update.bind(categoryController)
)
router.delete(
  '/categories/:id',
  categoryController.delete.bind(categoryController)
)
router.get(
  '/categories/:id',
  categoryController.findById.bind(categoryController)
)
router.get(
  '/categories',
  pagingValidation,
  categoryController.paging.bind(categoryController)
)
router.post(
  '/categories/exists/criteria',
  criteriaValidation,
  categoryController.existsByCriteria.bind(categoryController)
)
router.post(
  '/categories/criteria',
  criteriaValidation,
  categoryController.pagingByCriteria.bind(categoryController)
)

export default router
