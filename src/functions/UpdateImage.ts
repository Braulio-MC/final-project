import * as v2 from 'firebase-functions/v2'
import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import { firebaseHelper } from '../di/Container'

export const updateImage = v2.https.onRequest(async (request, response) => {
  try {
    const oldPath = request.body.data.oldPath
    const newPath = request.body.data.newPath
    const newImageBase64 = request.body.data.newImageBase64
    const newFileName = request.body.data.newFileName
    const newFileType = request.body.data.newFileType
    if ([oldPath, newPath, newImageBase64, newFileName, newFileType].some(v => typeof v !== 'string' || v.trim() === '')) {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'Invalid input: All fields must be non-empty strings' })
      return
    }
    const firebaseStorageUrlPattern = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/(.+?)(\?.*)?$/
    const match = (oldPath as string).match(firebaseStorageUrlPattern)
    if (match === null) {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'Invalid oldPath format' })
      return
    }
    const oldImagePath = decodeURIComponent(match[1])
    const bucket = firebaseHelper.storage.bucket()
    // Save new image in storage
    const finalPath = `${newPath as string}/${newFileName as string}`
    const imageBuf = Buffer.from(newImageBase64, 'base64')
    const file = bucket.file(finalPath)
    await file.save(imageBuf, { contentType: newFileType })
    // Delete old image in storage
    const oldImage = bucket.file(oldImagePath)
    const [oldImageExists] = await oldImage.exists()
    if (oldImageExists) {
      await oldImage.delete()
    }
    const token = crypto.randomUUID()
    await file.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } })
    const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(finalPath)}?alt=media&token=${token}`
    response.status(StatusCodes.OK).send({ data: firebaseUrl })
  } catch (e) {
    console.error('An error occurred when updateImage was called', e)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error updating image' })
  }
})
