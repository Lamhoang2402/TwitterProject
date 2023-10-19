import express from 'express'
import userRoute from './routes/users.routes'
import databaseService from './services/database.services'
const app = express()
app.use(express.json())
const PORT = 3000
databaseService.connect()
//route localhost:3000/
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', userRoute)
//localhost:3000/api/tweets

app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`)
})
