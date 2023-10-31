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

/*
des: verify email token
khi người dùng đky họ sẽ nhận dc mail có link dạng 
https://localhost:3000/users/verify-email?token=<email_verify_token>
nếu mà em nhấp vào linnk thì sẽ tạo ra req gửi lên email_verify_token lên server
server kiểm tra email_verify_token có hợp lệ hay không ?
thì từ decoded_email_verify_token thành '', verify = 1, update_at

*/
export default userRoute
