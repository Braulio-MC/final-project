import { inject, singleton } from 'tsyringe'
import IUserService from './IUserService'
import { GetStreamUser } from '../../../types'
import GetStreamUserRepository from '../../repository/user/GetStreamUserRepository'

@singleton()
export default class UserService implements IUserService {
  constructor (
    @inject(GetStreamUserRepository) private readonly userRepository: GetStreamUserRepository
  ) {}

  async create (users: GetStreamUser[]): Promise<void> {
    await this.userRepository.create(users)
  }
}
