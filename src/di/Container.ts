import { container } from 'tsyringe'
import { algoliaClient } from '../core/AlgoliaHelper'
import { getStreamClient } from '../core/GetStreamHelper'
import GetStreamTokenProvider from '../data/provider/token/GetStreamTokenProvider'
import TokenController from '../controllers/Token.controller'
import ChannelController from '../controllers/Channel.controller'
import UserController from '../controllers/User.controller'

container.register(
  'AlgoliaClient',
  { useValue: algoliaClient }
)

container.register(
  'GetStreamClient',
  { useValue: getStreamClient }
)

container.register(
  'TokenProvider',
  { useClass: GetStreamTokenProvider }
)

export const tokenController = container.resolve(TokenController)
export const channelController = container.resolve(ChannelController)
export const userController = container.resolve(UserController)
