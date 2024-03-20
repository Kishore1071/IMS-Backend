import express, { json, urlencoded} from 'express'
import { set, connect } from 'mongoose'
import { config } from 'dotenv'
import cors from 'cors'
import UserRouter from './authentication/userRouter.js'


const app = express()
app.use(json())
app.use(urlencoded({extended: true}))
app.use(cors())

config()
set('strictQuery', false)

const PORT = process.env.PORT
const MONGODB = process.env.MONGODB_STRING

app.use('/user/', UserRouter)

const start = async () => {

    await connect(`${MONGODB}`)
    app.listen(PORT, () => console.log(`Ims Serving on the Port ${PORT}`))

}

start()