import { Router } from 'express'
import {
  accessTokenvalidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import {
  emailVerifyTokenController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
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
thì từ decoded_email_verify_token lấy ra user_id
và vào user_id đó để update email_verify_token thành '', verify = 1, update_at
path: /users/verify-email
method: POST
body: {email_verify_token: string}
*/
userRoute.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyTokenController))

/*
des: resend email verify token
khi mail thất lạc , hoặc email_verify_token hết hạn, thì người dùng có
nhu cầu resend email_verify_token

method: post
path: /users/resend-email-verify-token
header: {Authorization: 'Bearer <access_token>'} //đăng nhập mới cho resend email verify
body: {}
*/
userRoute.post('/resend-verify-email', accessTokenvalidator, wrapAsync(resendEmailVerifyController))

/*
des: khi người dùng quên mk, họ gửi email để xin mình tạo cho họ forgot_password_token
method: POST
body: {email: string}
*/
userRoute.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
des: khi người dùng nhấp vào link trong email để reset password
họ sẽ gửi 1 req kèm theo forgot_password_token lên server
server sẽ kiểm tra forgot_password_token co hợp lệ hay không ?
sau đó chuyển hướng người dùng đến trang reset password
path: /users/verify-forgot-password
method: POST
body: {forgot_password_token: string}
*/
userRoute.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)
export default userRoute
