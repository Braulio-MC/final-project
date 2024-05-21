import { inject, singleton } from 'tsyringe'
import DeliveryLocationDto from '../dto/DeliveryLocationDto'
import DeliveryLocation from '../model/DeliveryLocation'
import mapper from '../../core/Mapper'
import IService from './IService'
import IDeliveryLocationRepository from '../repository/deliverylocation/IDeliveryLocationRepository'
import Criteria from '../../core/criteria/Criteria'
import { PagingResult } from '../../types'

@singleton()
export default class DeliveryLocationService implements IService<DeliveryLocationDto, DeliveryLocation> {
  constructor (
    @inject('DeliveryLocationRepository') private readonly repository: IDeliveryLocationRepository
  ) {}

  async create (item: DeliveryLocationDto): Promise<void> {
    await this.repository.create(item)
  }

  async update (id: string, item: Partial<DeliveryLocationDto>): Promise<void> {
    await this.repository.update(id, item)
  }

  async paging (limit: number, after: string, before: string): Promise<PagingResult<DeliveryLocation>> {
    const result = await this.repository.paging(limit, after, before)
    const pagignResult: PagingResult<DeliveryLocation> = {
      data: result.data.map(dto => mapper.map<DeliveryLocationDto, DeliveryLocation>(dto, 'DeliveryLocationDto', 'DeliveryLocation')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }

  async findById (id: string): Promise<DeliveryLocation | null> {
    const result = await this.repository.findById(id)
    if (result !== null) {
      return mapper.map<DeliveryLocationDto, DeliveryLocation>(result, 'DeliveryLocationDto', 'DeliveryLocation')
    }
    return null
  }

  async delete (id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async pagingByCriteria (criteria: Criteria): Promise<PagingResult<DeliveryLocation>> {
    const result = await this.repository.pagingByCriteria(criteria)
    const pagignResult: PagingResult<DeliveryLocation> = {
      data: result.data.map(dto => mapper.map<DeliveryLocationDto, DeliveryLocation>(dto, 'DeliveryLocationDto', 'DeliveryLocation')),
      pagination: {
        prev: result.pagination.prev,
        next: result.pagination.next
      }
    }
    return pagignResult
  }
}
