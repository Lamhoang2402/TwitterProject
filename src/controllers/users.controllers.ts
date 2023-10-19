import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.request'
export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body

  if (email === 'test@gmail.com' && password === '123456') {
    return res.json({
      message: 'login successfully',
      result: [
        { name: 'Lam', yob: 2004 },
        { name: 'Khang', yob: 2003 },
        { name: 'Dat', yob: 2002 }
      ]
    })
  }
  res.status(400).json({
    error: 'login failed'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    res.json({
      message: 'register succesfully',
      result
    })
  } catch (error) {
    res.status(400).json({
      message: 'register failed',
      error
    })
  }
}
