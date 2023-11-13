import { Request, Response } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import { validate } from './validation'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }
  })
}

export const getNameFromFullname = (filename: string) => {
  const nameArr = filename.split('.')
  nameArr.pop()
  return nameArr.join('')
}

export const getExtension = (filename: string) => {
  const nameArr = filename.split('.')
  return nameArr[nameArr.length - 1]
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_IMAGE_TEMP_DIR),
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 300 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.image) {
        return reject(new Error('Image is empty'))
      }
      return resolve(files.image as File[])
    })
  })
}
//vào body nhận req và xử lý video xem có thoả yêu cầu và lưu vào video/temp
export const handleUploadVideo = async (req: Request) => {
  //cấu hình rằng mình sẽ nhận vào video thế nào: formidable
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR, //upload/video
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = 'video' && Boolean(mimetype?.includes('video/'))

      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.video) {
        return reject(new Error('Video is empty'))
      }
      //danh sách các video đã up
      const video = files.video as File[]
      //gán đuôi cũ vào cho nó
      video.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        //filepath là đường dẫn mới của video nhưng k có đuôi
        //vì mình k dùng keepExtension
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        //newFilename là tên mới của video nhưng k có đuôi
        video.newFilename = video.newFilename + '.' + ext
      })
      return resolve(files.video as File[])
    })
  })
}
