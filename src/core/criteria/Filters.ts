import Filter from './Filter'

export default class Filters {
  private readonly filters: Filter[]

  constructor (filters: Filter[] = []) {
    this.filters = filters
  }

  public add (filter: Filter): void {
    this.filters.push(filter)
  }

  public getFilters (): Filter[] {
    return this.filters
  }

  public isEmpty (): boolean {
    return this.filters.length > 0
  }

  public static empty (): Filters {
    return new Filters([])
  }
}
