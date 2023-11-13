import { Router } from 'express'
import {
  accessTokenvalidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordValidator
} from '~/middlewares/users.middlewares'
import {
  changePasswordController,
  emailVerifyTokenController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  oAuthController,
  refreshTokenController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import { wrapAsync } from '~/utils/handlers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.request'
const userRoute = Router()

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/

userRoute.post('/login', loginValidator, wrapAsync(loginController))

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
userRoute.post('/verify-forgot-password', verifyForgotPasswordValidator, wrapAsync(verifyForgotPasswordTokenController))

/*
des: reset password
path: '/reset-password'
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string, password: string, confirm_password: string}
*/
userRoute.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordValidator,
  wrapAsync(resetPasswordController)
)

/*
des: get profile của user
path: '/me'
method: get
Header: {Authorization: Bearer <access_token>}
body: {}
*/
userRoute.get('/me', accessTokenvalidator, wrapAsync(getMeController))

userRoute.patch(
  '/me',
  accessTokenvalidator,
  verifiedUserValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'avatar',
    'username',
    'cover_photo'
  ]),
  updateMeValidator,
  wrapAsync(updateMeController)
)

userRoute.get('/:username', wrapAsync(getProfileController))

/*
des: Follow someone
path: '/follow'
method: post
headers: {Authorization: Bearer <access_token>}
body: {followed_user_id: string}
*/
/*
user lamhoang24024 654b965d8aa3b5753aff4536
user lamhoang24025 654b972ce41bc339aaec750a
*/
userRoute.post('/follow', accessTokenvalidator, verifiedUserValidator, followValidator, wrapAsync(followController))

/*
    des: unfollow someone
    path: '/follow/:user_id'
    method: delete
    headers: {Authorization: Bearer <access_token>}
  g}
    */
userRoute.delete(
  '/unfollow/:user_id',
  accessTokenvalidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapAsync(unfollowController)
)

/*
  des: change password
  path: '/change-password'
  method: PUT
  headers: {Authorization: Bearer <access_token>}
  Body: {old_password: string, password: string, confirm_password: string}
g}
  */
userRoute.put(
  '/change-password',
  accessTokenvalidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapAsync(changePasswordController)
)
//changePasswordValidator kiểm tra các giá trị truyền lên trên body cớ valid k ?
/*
  des: refreshtoken
  path: '/refresh-token'
  method: POST
  Body: {refresh_token: string}
g}
  */
userRoute.post('/refresh-token', refreshTokenValidator, wrapAsync(refreshTokenController))
//khỏi kiểm tra accesstoken, tại nó hết hạn rồi mà
//refreshController chưa làm

userRoute.get('/oauth/google', wrapAsync(oAuthController))
export default userRoute
