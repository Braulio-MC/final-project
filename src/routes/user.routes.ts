import { Router } from 'express'
import { userValidation } from '../validation/validator'
import { userController } from '../di/Container'

const router = Router()

router.post(
  '/users/getstream',
  userValidation.createGetStreamUser,
  userController.create.bind(userController)
)

export default router
