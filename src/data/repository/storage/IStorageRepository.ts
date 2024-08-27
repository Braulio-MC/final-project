export default interface IStorageRepository {
  saveImage: (localPath: string, storagePath: string, type: string) => Promise<string>
  updateImage: (localPath: string, storagePath: string, type: string, id: string) => Promise<string>
}
