import { inject, singleton } from 'tsyringe'
import ITokenService from './ITokenServices'
import ITokenProvider from '../../provider/token/ITokenProvider'
import GetStreamTokenProvider from '../../provider/token/GetStreamTokenProvider'

@singleton()
export default class TokenService implements ITokenService {
  constructor (
    @inject(GetStreamTokenProvider) private readonly provider: ITokenProvider
  ) {}

  getToken (userId: string): string {
    return this.provider.getToken(userId)
  }
}
