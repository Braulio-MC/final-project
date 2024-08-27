import { FieldPath } from 'firebase-admin/firestore'
import Criteria from '../../../core/criteria/Criteria'
import Filter from '../../../core/criteria/Filter'
import FilterOperators from '../../../core/criteria/FilterOperators'
import Filters from '../../../core/criteria/Filters'
import Order from '../../../core/criteria/Order'
import { DEFAULT_PAGING_AFTER, DEFAULT_PAGING_BEFORE, DEFAULT_PAGING_LIMIT } from '../../../core/Constants'
import { FirestoreFilter, FirestoreQuery, FirestoreSort, TransformerFunction } from '../../../types'

export default class FirestoreCriteriaConverter {
  private readonly filterTransformers: Map<FilterOperators, TransformerFunction<Filter, FirestoreFilter>>

  constructor () {
    this.filterTransformers = new Map<FilterOperators, TransformerFunction<Filter, FirestoreFilter>>([
      [FilterOperators.LT, this.lowerThanFilter],
      [FilterOperators.LEQ, this.lowerOrEqualThanFilter],
      [FilterOperators.EQUAL, this.equalFilter],
      [FilterOperators.GT, this.greaterThanFilter],
      [FilterOperators.GEQ, this.greaterOrEqualThanFilter],
      [FilterOperators.NEQ, this.notEqualFilter],
      [FilterOperators.ARRAY_CONTAINS, this.arrayContainsFilter],
      [FilterOperators.ARRAY_CONTAINS_ANY, this.arrayContainsAnyFilter],
      [FilterOperators.IN, this.inFilter],
      [FilterOperators.NOT_IN, this.notInFilter]
    ])
  }

  public convert (criteria: Criteria): FirestoreQuery {
    const query = {
      filters: this.makeFirestoreFilters(criteria.filters),
      sort: FirestoreCriteriaConverter.makeFirestoreSort(criteria.order),
      limit: criteria.limit ?? DEFAULT_PAGING_LIMIT,
      after: criteria.after ?? DEFAULT_PAGING_AFTER,
      before: criteria.before ?? DEFAULT_PAGING_BEFORE
    }
    return query
  }

  private makeFirestoreFilters (filters: Filters): FirestoreFilter[] {
    const firestoreFilters = filters.getFilters().map(filter => {
      const transformer = this.filterTransformers.get(filter.operator.value)

      if (transformer === undefined) {
        throw Error(`Unexpected operator value ${filter.operator.value}`)
      }
      return transformer(filter)
    })
    return firestoreFilters
  }

  private static makeFirestoreSort (order: Order): FirestoreSort {
    if (order.hasOrder()) {
      const sort: FirestoreSort = {
        field: order.orderBy,
        direction: order.orderType.isAsc() ? 'asc' : 'desc'
      }
      return sort
    }
    return { field: '', direction: 'desc' }
  }

  private static makeFirestoreField (filter: Filter): string | FieldPath {
    if (typeof filter.field === 'string') {
      return filter.field
    }
    return new FieldPath(...filter.field._value)
  }

  //* map possible values to firestore values
  private static makeFirestoreValue (filter: Filter): any {
    if (filter.field instanceof Object) {
      if (filter.field._value[0] === 'createdAt') {
        return new Date(filter.value)
      } else if (filter.field._value[0] === 'updatedAt') {
        return new Date(filter.value)
      } else {
        return filter.value
      }
    }
    return filter.value // value is string
  }

  private lowerThanFilter (filter: Filter): FirestoreFilter {
    const firestoreFilter: FirestoreFilter = {
      field: FirestoreCriteriaConverter.makeFirestoreField(filter),
      operator: '<',
      value: FirestoreCriteriaConverter.makeFirestoreValue(filter)
    }
    return firestoreFilter
  }

  private lowerOrEqualThanFilter (filter: Filter): FirestoreFilter {
    const firestoreFilter: FirestoreFilter = {
      field: FirestoreCriteriaConverter.makeFirestoreField(filter),
      operator: '<=',
      value: FirestoreCriteriaConverter.makeFirestoreValue(filter)
    }
    return firestoreFilter
  }

  private equalFilter (filter: Filter): FirestoreFilter {
    const firestoreFilter: FirestoreFilter = {
      field: FirestoreCriteriaConverter.makeFirestoreField(filter),
      operator: '==',
      value: FirestoreCriteriaConverter.makeFirestoreValue(filter)
    }
    return firestoreFilter
  }

  private greaterThanFilter (filter: Filter): FirestoreFilter {
    const firestoreFilter: FirestoreFilter = {
      field: FirestoreCriteriaConverter.makeFirestoreField(filter),
      operator: '>',
      value: FirestoreCriteriaConverter.makeFirestoreValue(filter)
    }
    return firestoreFilter
  }

  private greaterOrEqualThanFilter (filter: Filter): FirestoreFilter {
    const firestoreFilter: FirestoreFilter = {
      field: FirestoreCriteriaConverter.makeFirestoreField(filter),
      operator: '>=',
      value: FirestoreCriteriaConverter.makeFirestoreValue(filter)
    }
    return firestoreFilter
  }

  private notEqualFilter (filter: Filter): FirestoreFilter {
    const firestoreFilter: FirestoreFilter = {
      field: FirestoreCriteriaConverter.makeFirestoreField(filter),
      operator: '!=',
      value: FirestoreCriteriaConverter.makeFirestoreValue(filter)
    }
    return firestoreFilter
  }

  private arrayContainsFilter (filter: Filter): FirestoreFilter {
    const firestoreFilter: FirestoreFilter = {
      field: FirestoreCriteriaConverter.makeFirestoreField(filter),
      operator: 'array-contains',
      value: FirestoreCriteriaConverter.makeFirestoreValue(filter)
    }
    return firestoreFilter
  }

  private arrayContainsAnyFilter (filter: Filter): FirestoreFilter {
    const firestoreFilter: FirestoreFilter = {
      field: FirestoreCriteriaConverter.makeFirestoreField(filter),
      operator: 'array-contains-any',
      value: FirestoreCriteriaConverter.makeFirestoreValue(filter)
    }
    return firestoreFilter
  }

  private inFilter (filter: Filter): FirestoreFilter {
    const firestoreFilter: FirestoreFilter = {
      field: FirestoreCriteriaConverter.makeFirestoreField(filter),
      operator: 'in',
      value: FirestoreCriteriaConverter.makeFirestoreValue(filter)
    }
    return firestoreFilter
  }

  private notInFilter (filter: Filter): FirestoreFilter {
    const firestoreFilter: FirestoreFilter = {
      field: FirestoreCriteriaConverter.makeFirestoreField(filter),
      operator: 'not-in',
      value: FirestoreCriteriaConverter.makeFirestoreValue(filter)
    }
    return firestoreFilter
  }
}
