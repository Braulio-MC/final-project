import { GetStreamUser } from '../../../types'

export default interface IUserService {
  create: (users: GetStreamUser[]) => Promise<void>
}
