import { Router } from 'express'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controllers'
const userRoute = Router()

userRoute.get('/login', loginValidator, loginController)

userRoute.post('/register', registerValidator, registerController)

export default userRoute
