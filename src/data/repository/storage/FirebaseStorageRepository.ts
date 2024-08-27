import { inject, singleton } from 'tsyringe'
import IStorageRepository from './IStorageRepository'
import { Storage, getDownloadURL } from 'firebase-admin/storage'
import fs from 'fs/promises'
import StoreService from '../../service/Store.service'

@singleton()
export default class FirebaseStorageRepository implements IStorageRepository {
  constructor (
    @inject('FirebaseStorage') private readonly storage: Storage,
    @inject(StoreService) private readonly storeService: StoreService
  ) {}

  private async readImageFromLocal (localPath: string): Promise<Buffer> {
    try {
      const result = await fs.readFile(localPath)
      return result
    } catch (error: any) {
      throw new Error('Error reading image file from path')
    }
  }

  private async unlinkImageFromLocal (localPath: string): Promise<void> {
    try {
      await fs.unlink(localPath)
    } catch (error: any) {
      throw new Error('Error unlinking image file from path')
    }
  }

  async saveImage (localPath: string, storagePath: string, type: string): Promise<string> {
    try {
      // Read image from local path previously uploaded by multer
      const imageInLocal = await this.readImageFromLocal(localPath)
      // Save image in storage
      const imageInStorage = this.storage.bucket().file(storagePath)
      await imageInStorage.save(imageInLocal, { contentType: type })
      // Unlink image from local path previously uploaded by multer
      await this.unlinkImageFromLocal(localPath)
      // Return image url
      return await getDownloadURL(imageInStorage)
    } catch (error: any) {
      console.log(error)
      throw new Error('Error saving image in storage')
    }
  }

  async updateImage (localPath: string, storagePath: string, type: string, id: string): Promise<string> {
    try {
      // Find store by id to get the store image url
      const store = await this.storeService.findById(id)
      if (store == null) {
        throw new Error('Store not found with provided id')
      }
      // Read image from local path previously uploaded by multer
      const imageInLocal = await this.readImageFromLocal(localPath)
      // Save new image in storage
      const ImageInStorage = this.storage.bucket().file(storagePath)
      await ImageInStorage.save(imageInLocal, { contentType: type })
      // Delete old image in storage
      const oldImageInStorage = decodeURIComponent(store.image.split('/o/')[1].split('?alt=media')[0])
      await this.storage.bucket().file(oldImageInStorage).delete()
      // Unlink image from local path previously uploaded by multer
      await this.unlinkImageFromLocal(localPath)
      // Return new image url
      return await getDownloadURL(ImageInStorage)
    } catch (error: any) {
      console.log(error)
      throw new Error('Error updating image in storage')
    }
  }
}
