import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.request'
export const loginController = async (req: Request, res: Response) => {
  //lấy user_od từ user của req
  const { user }: any = req
  const user_id = user._id
  //dùng user_id tạo access_token và refresh_token
  const result = await usersService.login(user_id.toString())
  //res về acccess_token và refresh_token
  res.json({
    message: 'login succesfully',
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  res.json({
    message: 'register succesfully',
    result
  })
}
