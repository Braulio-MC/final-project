import { StreamChat } from 'stream-chat'
import { getStreamConfig } from './Configuration'

export const getStreamClient = StreamChat.getInstance(getStreamConfig.apiKey as string, getStreamConfig.apiSecret as string)
