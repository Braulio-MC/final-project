import { StreamChat } from 'stream-chat'
import { singleton } from 'tsyringe'

@singleton()
export class GetStreamHelper {
  private _client: StreamChat | null = null

  private get clientInstance (): StreamChat {
    if (this._client == null) {
      const apiKey = process.env.GET_STREAM_API_KEY
      const apiSecret = process.env.GET_STREAM_API_SECRET
      if ((apiKey == null) || (apiSecret == null)) {
        throw new Error('GetStream credentials not configured')
      }

      this._client = StreamChat.getInstance(apiKey, apiSecret)
    }
    return this._client
  }

  get client (): StreamChat {
    return this.clientInstance
  }
}
