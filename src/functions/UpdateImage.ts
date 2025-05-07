import { onCall, HttpsError } from 'firebase-functions/v2/https'
import crypto from 'crypto'
import { firebaseHelper } from '../di/Container'

export const updateImage = onCall(async (request, _response) => {
  try {
    const { oldPath, newPath, newImageBase64, newFileName, newFileType } = request.data

    if ([oldPath, newPath, newImageBase64, newFileName, newFileType].some(v => typeof v !== 'string' || v.trim() === '')) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid argument types or empty values',
        'oldPath, newPath, newImageBase64, newFileName, newFileType must be non-empty strings'
      )
    }

    const firebaseStorageUrlPattern = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/(.+?)(\?.*)?$/
    const match = (oldPath as string).match(firebaseStorageUrlPattern)

    if (match === null) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid oldPath format',
        'oldPath must be a valid Firebase Storage URL'
      )
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
