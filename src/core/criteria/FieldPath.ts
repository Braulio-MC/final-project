export default class FieldPath {
  readonly _value: string[]

  constructor (...value: string[]) {
    this._value = value
  }

  public value (): string[] {
    return this._value
  }

  toRedisKey (): string {
    return this._value.join('.')
  }
}
