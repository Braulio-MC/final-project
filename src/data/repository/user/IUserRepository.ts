import { GetStreamUser } from '../../../types'

export default interface IUserRepository {
  create: (users: GetStreamUser[]) => Promise<void>
}
