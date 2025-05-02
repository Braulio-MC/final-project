import { container } from 'tsyringe'
import { AlgoliaHelper } from '../core/AlgoliaHelper'
import { FirebaseHelper } from '../core/FirebaseHelper'
import { GetStreamHelper } from '../core/GetStreamHelper'
import ChannelController from '../controllers/Channel.controller'
import TokenController from '../controllers/Token.controller'
import UserController from '../controllers/User.controller'

export const algoliaHelper = container.resolve(AlgoliaHelper)
export const firebaseHelper = container.resolve(FirebaseHelper)
export const getStreamHelper = container.resolve(GetStreamHelper)
export const channelController = container.resolve(ChannelController)
export const tokenController = container.resolve(TokenController)
export const userController = container.resolve(UserController)
