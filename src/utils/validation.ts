import express from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema.d'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req)

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const errorObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    //xử lý errorObject
    for (const key in errorObject) {
      //lấy msg của từng cái lỗi
      const { msg } = errorObject[key]
      //nếu msg nào có dạng như ErrorWithStatus và có status khác 422 thì ném lỗi
      //cho default error handler xử lý
      if (msg instanceof ErrorWithStatus && msg.status !== 422) {
        return next(msg)
      }

      //lỗi các lỗi 422 từ errorObject vào entityError
      entityError.errors[key] = msg
    }
    //ở đây nó xử lý lỗi luôn, chứ k ném về error handler
    next(entityError)
  }
}
