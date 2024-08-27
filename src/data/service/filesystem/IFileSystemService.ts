import { Mode } from 'fs'

export default interface IFileSystemService {
  mkDir: (path: string, options: { recursive?: boolean, mode?: Mode }) => Promise<string | undefined>
  rmPosix: (path: string, options: { recursive?: boolean, force?: boolean }) => Promise<void>
  move: (source: string, destination: string) => Promise<void>
}
