import { Router } from 'express'
import { channelValidation } from '../validation/validator'
import { channelController } from '../di/Container'

const router = Router()

router.post(
  '/channels',
  channelValidation.createChannel,
  channelController.create.bind(channelController)
)

router.post(
  '/channels/distinct',
  channelValidation.createChannelDistinct,
  channelController.createDistinct.bind(channelController)
)

export default router
