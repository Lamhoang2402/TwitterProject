import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'
import fs from 'fs'
import mime from 'mime'
import Mime from 'mime/Mime'
export const uploadImageController = async (req: Request, res: Response) => {
  const url = await mediasService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveImageController = async (req: Request, res: Response) => {
  const { namefile } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, namefile), (error) => {
    if (error) {
      return res.status((error as any).status).send('Not found image')
    }
  })
}

export const uploadIVideoController = async (req: Request, res: Response) => {
  const url = await mediasService.uploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveVideoStreamController = async (req: Request, res: Response) => {
  const { namefile } = req.params
  const range = req.headers.range //lấy range từ trong headers ra
  console.log(range)
  //lấy đường dẫn tới video đó
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, namefile)
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Required Range header')
  }

  //tổng dung lượng của video
  const videoSize = fs.statSync(videoPath).size
  const CHUCK_SIZE = 10 ** 6 //1MB
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + CHUCK_SIZE, videoSize - 1)

  //dung lượng sẽ load thực tế
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videosStreams = fs.createReadStream(videoPath, { start, end })
  videosStreams.pipe(res)
}
