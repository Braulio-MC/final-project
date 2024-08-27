import { inject, singleton } from 'tsyringe'
import IUserRepository from './IUserRepository'
import { StreamChat } from 'stream-chat'
import { GetStreamUser } from '../../../types'

@singleton()
export default class GetStreamUserRepository implements IUserRepository {
  constructor (
    @inject('GetStreamClient') private readonly getStreamClient: StreamChat
  ) {}

  async create (users: GetStreamUser[]): Promise<void> {
    await this.getStreamClient.upsertUsers(users.map(user => {
      return {
        id: user.id,
        name: user.name,
        role: user.role
      }
    }))
  }
}
