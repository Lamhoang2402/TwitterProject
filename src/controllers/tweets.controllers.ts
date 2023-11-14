import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetRequestBody } from '../models/requests/Tweet.request'
import { TokenPayload } from '~/models/requests/User.request'
import { TWEETS_MESSAGES } from '~/constants/messages'
import tweetsService from '~/services/tweets.services'

export const createTweetController = async (
  req: Request<ParamsDictionary, any, TweetRequestBody>,
  res: Response
) => {
  const body = req.body as TweetRequestBody
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweet(user_id, body)
  return res.json({
    message: TWEETS_MESSAGES.TWEET_CREATED_SUCCESSFULLY, // thêm TWEET_CREATED_SUCCESSFULLY: 'Tweet created success'
    result
  })
}
