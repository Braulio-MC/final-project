import { inject, singleton } from 'tsyringe'
import IUserRepository from './IUserRepository'
import { GetStreamUser } from '../../../types'
import { GetStreamHelper } from '../../../core/GetStreamHelper'

@singleton()
export default class GetStreamUserRepository implements IUserRepository {
  constructor (
    @inject(GetStreamHelper) private readonly getStreamHelper: GetStreamHelper
  ) {}

  async create (users: GetStreamUser[]): Promise<void> {
    await this.getStreamHelper.client.upsertUsers(users.map(user => {
      return {
        id: user.id,
        name: user.name,
        role: user.role
      }
    }))
  }
}
