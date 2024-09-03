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
    const channel = this.client.channel(type, id, {
      blocked: options.blocked,
      name: options.name,
      members: options.members,
      created_by_id: this._serverSideUserId
    })
    const response = await channel.create()
    return response.channel.id
  }

  async createDistinct (type: GetStreamMessagingChannelTypes, members: string[]): Promise<string> {
    const channel = this.client.channel(type, {
      members,
      created_by_id: this._serverSideUserId
    })
    const response = await channel.create()
    return response.channel.id
  }
}
