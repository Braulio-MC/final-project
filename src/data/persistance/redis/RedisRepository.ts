import { Timestamp } from 'firebase-admin/firestore'
import { RedisClientType, commandOptions } from 'redis'
import { inject, singleton } from 'tsyringe'
import { RedisStreamRangeResult, RedisStreamReadResult, RedisxTrimStrategy, RedisxTrimStrategyModifier } from '../../../types'

@singleton()
export default class RedisRepository {
  constructor (
    @inject('RedisClient') private readonly client: RedisClientType
  ) { }

  private async tryConnect (): Promise<void> {
    if (this.client.isReady) {
      return
    }
    await this.client.connect()
  }

  async isHealthy (): Promise<boolean> {
    await this.tryConnect()
    const result = await this.client.ping()
    return result === 'PONG'
  }

  private replacer (_key: any, value: any): any {
    if (value instanceof Timestamp) {
      return value.toMillis()
    }
    return value
  }

  async set<T>(
    key: string,
    value: T,
    args: { ttl?: number } = {}
  ): Promise<boolean> {
    await this.tryConnect()
    const valueToCache = typeof value === 'string' ? value : JSON.stringify(value, this.replacer)
    const result = await this.client.set(key, valueToCache, { PX: args.ttl })
    return result === 'OK'
  }

  async get<T>(key: string): Promise<T | null> {
    await this.tryConnect()
    const valueFromCache = await this.client.get(key)
    if (valueFromCache == null) {
      return null
    }
    try {
      return JSON.parse(valueFromCache)
    } catch {
      return null
    }
  }

  async lock (key: string, args: { ttl?: number } = {}): Promise<boolean> {
    await this.tryConnect()
    const result = await this.client.set(key, 'locked', { PX: args.ttl, NX: true })
    return result === 'OK'
  }

  async unlock (key: string): Promise<boolean> {
    await this.tryConnect()
    const result = await this.client.del(key)
    return result === 1
  }

  async sadd (setName: string, ...values: string[]): Promise<number> {
    await this.tryConnect()
    const result = await this.client.sAdd(setName, values)
    return result
  }

  async sismember (setName: string, memberName: string): Promise<boolean> {
    await this.tryConnect()
    const result = await this.client.sIsMember(setName, memberName)
    return result
  }

  async smembers (setName: string): Promise<string[]> {
    await this.tryConnect()
    const result = await this.client.sMembers(setName)
    return result
  }

  async xack (streamName: string, groupName: string, ...ids: string[]): Promise<number> {
    await this.tryConnect()
    const result = await this.client.xAck(streamName, groupName, ids)
    return result
  }

  async xadd (streamName: string, id: string, ...data: any): Promise<string> {
    await this.tryConnect()
    const result = await this.client.xAdd(streamName, id, data)
    return result
  }

  async xread (streams: Array<{ key: string, id: string }>, count: number, block: number): Promise<RedisStreamReadResult[] | null> {
    await this.tryConnect()
    const result = await this.client.xRead(
      commandOptions({ isolated: true }),
      streams,
      { COUNT: count, BLOCK: block }
    )
    return result
  }

  async xrange (
    streamName: string,
    start: string,
    end: string,
    count: number
  ): Promise<RedisStreamRangeResult[]> {
    await this.tryConnect()
    const result = await this.client.xRange(streamName, start, end, { COUNT: count })
    return result
  }

  // When maxOrId is ID and strategy is MINID, all entries that have an ID lower than 649085820-0 will be evicted
  // When maxOrId is a number and strategy is MAXLEN, this will trim the stream to exactly the latest maxOrId items
  async xtrim (
    streamName: string,
    strategy: RedisxTrimStrategy,
    maxOrId: number,
    options: { strategyModifier?: RedisxTrimStrategyModifier } = {}
  ): Promise<number> {
    await this.tryConnect()
    const result = await this.client.xTrim(streamName, strategy, maxOrId, { strategyModifier: options.strategyModifier })
    return result
  }

  async xlen (streamName: string): Promise<number> {
    await this.tryConnect()
    const result = await this.client.xLen(streamName)
    return result
  }
}
