import IRepository from '../IRepository'
import ProductDto from '../../dto/ProductDto'

export default interface IProductRepository extends IRepository<ProductDto> {
}
