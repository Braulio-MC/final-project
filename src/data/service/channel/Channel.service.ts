import { inject, singleton } from 'tsyringe'
import IChannelService from './IChannelService'
import GetStreamMessagingChannelTypes from '../../../core/GetStreamMessagingChannelTypes'
import GetStreamChannelRepository from '../../repository/channel/GetStreamChannelRepository'

@singleton()
export default class ChannelService implements IChannelService {
  constructor (
    @inject(GetStreamChannelRepository) private readonly channelRepository: GetStreamChannelRepository
  ) {}

  async create (type: GetStreamMessagingChannelTypes, id: string, options: { blocked?: boolean, name?: string } = {}): Promise<string> {
    return await this.channelRepository.create(type, id, options)
  }

  async createDistinct (type: GetStreamMessagingChannelTypes, members: string[]): Promise<string> {
    return await this.channelRepository.createDistinct(type, members)
  }
}
