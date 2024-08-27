import { NextFunction, Request, Response } from 'express'

export default interface IController {
  create: (req: Request, res: Response, next: NextFunction) => Promise<void>
  update: (req: Request, res: Response, next: NextFunction) => Promise<void>
  delete: (req: Request, res: Response, next: NextFunction) => Promise<void>
  findById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  paging: (req: Request, res: Response, next: NextFunction) => Promise<void>
  existsByCriteria: (req: Request, res: Response, next: NextFunction) => Promise<void>
  pagingByCriteria: (req: Request, res: Response, next: NextFunction) => Promise<void>
}
