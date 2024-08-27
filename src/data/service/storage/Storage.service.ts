import { inject, singleton } from 'tsyringe'
import IStorageService from './IStorageService'
import IStorageRepository from '../../repository/storage/IStorageRepository'

@singleton()
export default class StorageService implements IStorageService {
  constructor (
    @inject('StorageRepository') private readonly repository: IStorageRepository
  ) {}

  async saveImage (localPath: string, storagePath: string, type: string): Promise<string> {
    return await this.repository.saveImage(localPath, storagePath, type)
  }

  async updateImage (localPath: string, storagePath: string, type: string, id: string): Promise<string> {
    return await this.repository.updateImage(localPath, storagePath, type, id)
  }
}
