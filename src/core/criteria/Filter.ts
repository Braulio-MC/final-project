import FieldPath from './FieldPath'
import FilterOperator from './FilterOperator'

export default class Filter {
  constructor (
    public readonly field: string | FieldPath,
    public readonly operator: FilterOperator,
    public readonly value: any
  ) {
    this.field = field
    this.operator = operator
    this.value = value
  }

  public static fromValues (field: string | FieldPath, operator: string, value: any): Filter {
    if (field !== undefined && operator !== undefined && value !== undefined) {
      return new Filter(field, FilterOperator.fromValue(operator), value)
    }
    throw new Error('The filter is invalid')
  }

  toRedisKey (): string {
    const field = this.field instanceof FieldPath ? this.field.toRedisKey() : this.field
    return `${field}_${this.operator.toRedisKey()}_${JSON.stringify(this.value)}`
  }
}
