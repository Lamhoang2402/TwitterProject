import express, { NextFunction, Request, Response } from 'express'
import userRoute from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRoute from './routes/media.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRoute from './routes/static.routes'
import { MongoClient } from 'mongodb'
import tweetsRouter from './routes/tweets.routes'

config()
const app = express()
const router = express.Router()
const PORT = process.env.PORT || 4000
initFolder()
app.use(express.json())

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexFollowers()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', userRoute)
app.use('/medias', mediasRoute)
app.use('/tweets', tweetsRouter)
// app.use('/static', express.static(UPLOAD_IMAGE_DIR))
app.use('/static', staticRoute)
// app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
app.use(defaultErrorHandler)
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`)
})
