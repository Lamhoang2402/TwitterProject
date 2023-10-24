import { Router } from 'express'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controllers'
import { wrapAsync } from '~/utils/handlers'
const userRoute = Router()

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/

userRoute.get('/login', loginValidator, loginController)

userRoute.post('/register', registerValidator, wrapAsync(registerController))

export default userRoute
