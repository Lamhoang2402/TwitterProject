import { Router } from 'express'
import {
  accessTokenvalidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import { wrapAsync } from '~/utils/handlers'
const userRoute = Router()

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/

userRoute.get('/login', loginValidator, wrapAsync(loginController))

userRoute.post('/register', registerValidator, wrapAsync(registerController))
/*
  des: đăng xuất
  path: /users/logout
  method: POST
  Header: {Authorization: 'Bearer <access_token>'}
  body: {refresh_token: string}
 */
userRoute.post('/logout', accessTokenvalidator, refreshTokenValidator, wrapAsync(logoutController))
export default userRoute
