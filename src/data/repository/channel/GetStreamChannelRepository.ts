import { inject, singleton } from 'tsyringe'
import IChannelRepository from './IChannelRepository'
import { StreamChat } from 'stream-chat'
import GetStreamMessagingChannelTypes from '../../../core/GetStreamMessagingChannelTypes'
import { getStreamConfig } from '../../../core/Configuration'

@singleton()
export default class GetStreamChannelRepository implements IChannelRepository {
  private readonly _serverSideUserId = getStreamConfig.serverSideUserId as string

  constructor (
    @inject('GetStreamClient') private readonly client: StreamChat
  ) {}

  async create (type: GetStreamMessagingChannelTypes, id: string, options: { blocked?: boolean, name?: string, members?: string[] } = {}): Promise<string> {
    const filter = { type, id: { $eq: id } }
    const channels = await this.client.queryChannels(filter)
    if (channels.length > 0) {
      const channel = channels[0]
      if (channel.id !== undefined) {
        const id = `${type}:${channel.id}`
        return id
      }
    }
    const channel = this.client.channel(type, id, {
      blocked: options.blocked,
      name: options.name,
      members: options.members,
      created_by_id: this._serverSideUserId
    })
    const response = await channel.create()
    const resultId = `${type}:${response.channel.id}`
    return resultId
  }

  async createDistinct (type: GetStreamMessagingChannelTypes, members: string[]): Promise<string> {
    const filter = { type, members: { $eq: members }, created_by_id: { $eq: this._serverSideUserId } }
    const channels = await this.client.queryChannels(filter)
    if (channels.length > 0) {
      const channel = channels[0]
      if (channel.id !== undefined) {
        const id = `${type}:${channel.id}`
        return id
      }
    }
    const channel = this.client.channel(type, {
      members,
      created_by_id: this._serverSideUserId
    })
    const response = await channel.create()
    const resultId = `${type}:${response.channel.id}`
    return resultId
  }
}
