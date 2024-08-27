import GetStreamMessagingChannelTypes from '../../../core/GetStreamMessagingChannelTypes'

export default interface IChannelService {
  create: (type: GetStreamMessagingChannelTypes, id: string, options?: { blocked?: boolean, name?: string }) => Promise<string>
  createDistinct: (type: GetStreamMessagingChannelTypes, members: string[]) => Promise<string>
}
