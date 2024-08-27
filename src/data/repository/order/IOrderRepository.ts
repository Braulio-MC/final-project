import { OrderResult } from '../../../types'
import OrderDto from '../../dto/OrderDto'
import IRepository from '../IRepository'

export default interface IOrderRepository extends IRepository<OrderDto, OrderResult> {
}
