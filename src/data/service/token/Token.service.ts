import { inject, singleton } from 'tsyringe'
import ITokenService from './ITokenServices'
import ITokenProvider from '../../provider/token/ITokenProvider'

@singleton()
export default class TokenService implements ITokenService {
  constructor (
    @inject('TokenProvider') private readonly provider: ITokenProvider
  ) {}

  getToken (userId: string): string {
    return this.provider.getToken(userId)
  }
}
