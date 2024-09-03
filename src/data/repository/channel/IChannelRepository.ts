import GetStreamMessagingChannelTypes from '../../../core/GetStreamMessagingChannelTypes'

export default interface IChannelRepository {
  create: (type: GetStreamMessagingChannelTypes, id: string, options?: { blocked?: boolean, name?: string, members?: string[] }) => Promise<string>
  createDistinct: (type: GetStreamMessagingChannelTypes, members: string[]) => Promise<string>
}
