import { EnumValueObject } from '../valueObject/EnumValueObject'
import FilterOperators from './FilterOperators'

export default class FilterOperator extends EnumValueObject<FilterOperators> {
  constructor (value: FilterOperators) {
    super(value, Object.values(FilterOperators))
  }

  public static fromValue (value: string): FilterOperator {
    for (const operatorValue of Object.values(FilterOperators)) {
      if (value === operatorValue.toString()) {
        return new FilterOperator(operatorValue)
      }
    }
    throw new Error(`The filter operator ${value} is invalid`)
  }

  public isPositive (): boolean {
    return this.value !== FilterOperators.NEQ && this.value !== FilterOperators.NOT_IN
  }

  public static equal (): FilterOperator {
    return this.fromValue(FilterOperators.EQUAL)
  }

  protected throwErrorForInvalidEnumValue (value: FilterOperators): void {
    throw new Error(`The filter operator ${value} is invalid`)
  }
}
