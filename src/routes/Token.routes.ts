import { Router } from 'express'
import { tokenValidation } from '../validation/validator'
import { tokenController } from '../di/Container'
import { checkAccessToken } from '../middleware/auth0.middleware'

const router = Router()

router.post(
  '/get-stream-token',
  tokenValidation.createToken,
  tokenController.create.bind(tokenController)
)

router.post(
  '/get-secured-search-Key',
  checkAccessToken,
  tokenController.getAlgoliaSecuredSearchApiKey.bind(tokenController)
)

export default router
