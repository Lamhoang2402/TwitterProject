import { Router } from 'express'
import { uploadIVideoController, uploadImageController } from '~/controllers/medias.controllers'
import { accessTokenvalidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const mediasRoute = Router()

mediasRoute.post('/upload-image', accessTokenvalidator, verifiedUserValidator, wrapAsync(uploadImageController))
mediasRoute.post('/upload-video', accessTokenvalidator, verifiedUserValidator, wrapAsync(uploadIVideoController))
export default mediasRoute
