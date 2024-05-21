import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import ErrorResponse from './ErrorResponse'
import { ValidationError } from 'express-validator'

export const checkIncomingJson = (_req: Request, _res: Response, buf: Buffer, _encoding: string): void => {
  try {
    const bufString = buf.toString()
    JSON.parse(bufString)
  } catch (err) {
    throw new ErrorResponse('Invalid JSON', StatusCodes.BAD_REQUEST)
  }
}

export const expressErrorFormatter = (error: ValidationError): string => {
  switch (error.type) {
    case 'field': {
      return `${error.location}[${error.path}]: ${error.msg as string}`
    }
    default:
      throw new Error(`Unknown error type ${error.type}`)
  }
}
