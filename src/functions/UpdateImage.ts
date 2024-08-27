import * as v2 from 'firebase-functions/v2'
import { StatusCodes } from 'http-status-codes'
import { firebaseStorage } from '../core/FirebaseHelper'

export const updateImage = v2.https.onRequest(async (request, response) => {
  try {
    // const firebaseStorageUrlPattern = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^\/]+\/o\/[^?]+(\?.*)?$/
    const oldPath = request.body.data.oldPath
    const newPath = request.body.data.newPath
    const newImageBase64 = request.body.data.newImageBase64
    const newFileName = request.body.data.newFileName
    const newFileType = request.body.data.newFileType
    if (typeof oldPath !== 'string' || typeof newPath !== 'string' || typeof newImageBase64 !== 'string' || typeof newFileName !== 'string' || typeof newFileType !== 'string') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'Old path, new path, new image, new file name and new file type must be strings' })
      return
    }
    if (oldPath === '' || newPath === '' || newImageBase64 === '' || newFileName === '' || newFileType === '') {
      response.status(StatusCodes.BAD_REQUEST).send({ data: 'Old path, new path, new image, new file name and new file type must not be empty' })
      return
    }
    // Production
    // if (!firebaseStorageUrlPattern.test(oldPath)) {
    //   response.status(StatusCodes.BAD_REQUEST).send('Old path must be a valid firebase storage url')
    //   return
    // }
    const bucket = firebaseStorage.bucket()
    // Save new image in storage
    const finalPath = `${newPath}/${newFileName}`
    const imageBuf = Buffer.from(newImageBase64, 'base64')
    const file = bucket.file(finalPath)
    await file.save(imageBuf, { contentType: newFileType })
    // Delete old image in storage
    // Production
    // const oldImage = decodeURIComponent(oldPath.split('/o/')[1].split('?alt=media')[0])
    // Development
    const oldImage = decodeURIComponent(oldPath.split('.com/')[1])
    await bucket.file(oldImage).delete()
    // Make new image public
    await file.makePublic()
    response.status(StatusCodes.OK).send({ data: file.publicUrl() })
  } catch (e) {
    console.error('An error occurred when updateImage was called', e)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ data: 'Error updating image' })
  }
})
