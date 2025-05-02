import { inject, singleton } from 'tsyringe'
import ITokenProvider from './ITokenProvider'
import { GetStreamHelper } from '../../../core/GetStreamHelper'

@singleton()
export default class GetStreamTokenProvider implements ITokenProvider {
  constructor (
    @inject(GetStreamHelper) private readonly getStreamHelper: GetStreamHelper
  ) {}

  getToken (userId: string): string {
    const token = this.getStreamHelper.client.createToken(userId)
    return token
  }
}
