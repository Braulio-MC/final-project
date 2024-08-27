import { StreamChat } from 'stream-chat'
import { inject, singleton } from 'tsyringe'
import ITokenProvider from './ITokenProvider'

@singleton()
export default class GetStreamTokenProvider implements ITokenProvider {
  constructor (
    @inject('GetStreamClient') private readonly getStreamClient: StreamChat
  ) {}

  getToken (userId: string): string {
    const token = this.getStreamClient.createToken(userId)
    return token
  }
}
