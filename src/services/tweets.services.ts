import { TweetRequestBody } from '../models/requests/Tweet.request'
import databaseService from './database.services'
import Tweet from '~/models/schemas/Tweet.schema'
import { ObjectId } from 'mongodb'

class TweetsService {
  async createTweet(user_id: string, body: TweetRequestBody) {
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: [],
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id) //người tạo tweet
      })
    )
    //result: kết quả là obj có 2 thuộc tính {acknowledged: true, insertedId: 'id của tweet vùa tạo'}
    //lấy id của tweet vừa tạo
    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId })
    return tweet
  }
}

const tweetsService = new TweetsService()
export default tweetsService
