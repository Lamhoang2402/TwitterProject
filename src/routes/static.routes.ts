import { Router } from 'express'
import { serveImageController, serveVideoStreamController } from '~/controllers/medias.controllers'

const staticRoute = Router()

staticRoute.get('/image/:namefile', serveImageController)
staticRoute.get('/video-stream/:namefile', serveVideoStreamController)
export default staticRoute
