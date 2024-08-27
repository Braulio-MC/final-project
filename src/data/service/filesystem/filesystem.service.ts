import { Mode } from 'fs'
import IFileSystemService from './IFileSystemService'
import fs from 'fs/promises'
import { singleton } from 'tsyringe'

@singleton()
export default class FileSystemService implements IFileSystemService {
  async mkDir (path: string, options: { recursive?: boolean, mode?: Mode }): Promise<string | undefined> {
    try {
      const result = await fs.mkdir(path, { recursive: options.recursive, mode: options.mode })
      return result
    } catch (error: any) {
      throw new Error('Error creating directory')
    }
  }

  async rmPosix (path: string, options: { recursive?: boolean, force?: boolean } = {}): Promise<void> {
    try {
      await fs.rm(path, { recursive: options.recursive, force: options.force })
    } catch (error: any) {
      throw new Error('Error removing directory')
    }
  }

  async move (source: string, destination: string): Promise<void> {
    try {
      await fs.rename(source, destination)
    } catch (error: any) {
      throw new Error('Error moving file')
    }
  }
}
