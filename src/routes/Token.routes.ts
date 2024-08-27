import { Router } from 'express'
import { tokenValidation } from '../validation/validator'
import { tokenController } from '../di/Container'

const router = Router()

router.post(
  '/get-stream-token',
  tokenValidation.createToken,
  tokenController.create.bind(tokenController)
)

export default router
