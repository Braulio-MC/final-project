import { onCall, HttpsError } from 'firebase-functions/v2/https'
import crypto from 'crypto'
import { firebaseHelper } from '../di/Container'

export const uploadImage = onCall(async (request, _response) => {
  try {
    const { imageBase64, path, fileName, fileType } = request.data

    if ([imageBase64, path, fileName, fileType].some(v => typeof v !== 'string' || v.trim() === '')) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid argument types or empty values',
        'imageBase64, path, fileName, fileType must be non-empty strings'
      )
    }

    const finalPath = `${path as string}/${fileName as string}`
    const imageBuf = Buffer.from(imageBase64, 'base64')
    const bucket = firebaseHelper.storage.bucket()
    const file = bucket.file(finalPath)
    const [exists] = await file.exists()

    if (exists) {
      throw new HttpsError(
        'already-exists',
        'File already exists',
        'The file you are trying to upload already exists'
      )
    }

    await file.save(imageBuf, { contentType: fileType })
    const token = crypto.randomUUID()
    await file.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } })
    const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(finalPath)}?alt=media&token=${token}`

    return {
      data: firebaseUrl
    }
  } catch (e) {
    if (e instanceof HttpsError) throw e
    throw new HttpsError(
      'internal',
      'Error updating image',
      'An internal error occurred while updating the image'
    )
  }
})
