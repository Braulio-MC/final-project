import * as v2 from 'firebase-functions/v2'
import { StatusCodes } from 'http-status-codes'
import { firebaseStorage } from '../core/FirebaseHelper'

export const uploadImage = v2.https.onRequest(async (request, response) => {
  try {
    const imageBase64 = request.body.data.imageBase64
    const path = request.body.data.path
    const fileName = request.body.data.fileName
    const fileType = request.body.data.fileType
    if (typeof imageBase64 !== 'string' || typeof path !== 'string' || typeof fileName !== 'string' || typeof fileType !== 'string') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'Image, path and file name must be strings' })
      return
    }
    if (imageBase64 === '' || path === '' || fileName === '' || fileType === '') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'Image, path and file name must not be empty' })
      return
    }
    const finalPath = `${path}/${fileName}`
    const imageBuf = Buffer.from(imageBase64, 'base64')
    const bucket = firebaseStorage.bucket()
    const file = bucket.file(finalPath)
    await file.save(imageBuf, { contentType: fileType })
    await file.makePublic()
    response.status(StatusCodes.OK).send({ data: file.publicUrl() })
  } catch (e) {
    console.error('An error occurred when uploadImage was called', e)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error uploading image' })
  }
})
