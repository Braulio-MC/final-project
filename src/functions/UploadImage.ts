import * as v2 from 'firebase-functions/v2'
import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import { firebaseHelper } from '../di/Container'

export const uploadImage = v2.https.onRequest(async (request, response) => {
  try {
    const imageBase64 = request.body.data.imageBase64
    const path = request.body.data.path
    const fileName = request.body.data.fileName
    const fileType = request.body.data.fileType
    if ([imageBase64, path, fileName, fileType].some(v => typeof v !== 'string' || v.trim() === '')) {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'Invalid input: All fields must be non-empty strings' })
      return
    }
    const finalPath = `${path as string}/${fileName as string}`
    const imageBuf = Buffer.from(imageBase64, 'base64')
    const bucket = firebaseHelper.storage.bucket()
    const file = bucket.file(finalPath)
    const [exists] = await file.exists()
    if (exists) {
      response.status(StatusCodes.CONFLICT).send({ data: 'File already exists' })
      return
    }
    await file.save(imageBuf, { contentType: fileType })
    const token = crypto.randomUUID()
    await file.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } })
    const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(finalPath)}?alt=media&token=${token}`
    response.status(StatusCodes.OK).send({ data: firebaseUrl })
  } catch (e) {
    console.error('An error occurred when uploadImage was called', e)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error uploading image' })
  }
})
