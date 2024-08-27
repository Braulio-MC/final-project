import multer from 'multer'
import path from 'path'
import { MULTER_TEMP_DIR } from './Constants'

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, MULTER_TEMP_DIR)
  },
  filename: (_req, file, cb) => {
    const fileName = Date.now().toString() + path.extname(file.originalname)
    cb(null, fileName)
  }
})

export const multerUpload = multer({ storage: multerStorage })
