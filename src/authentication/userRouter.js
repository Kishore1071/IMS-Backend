import express, { response } from 'express'
import { User } from './userModel.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { authentication, newAccessToken } from './authentication.js'

const UserRouter = express.Router()


UserRouter.get('/all/', authentication,  async (request, response) => {
    
    const all_users = await User.find({})

    console.log(request.user, "User")

    response.json({
        status: true,
        user_data: all_users
    })
})

UserRouter.get('/generate/key/', (request, response) => {

    const key = crypto.randomBytes(64).toString('hex')

    response.json(key)
})

UserRouter.post('/create/', async (request, response) => {

    const all_user = await User.find({})

    const {username} = request.body

    const user_check = all_user.find(user => user.username === username)

    if (user_check === undefined) {
        
        const new_user = new User(request.body)

        await new_user.save()

        response.json("User Created")
    }

    else {
        response.json("User with the usename already exists!")
    }
})

UserRouter.post('/validate/', async (request, response) => {

    const {username, password} = request.body

    const all_user = await User.find({})

    const user_check = all_user.find(user => user.username === username)

    if (user_check === undefined) response.json({
        status: false,
        message: "Invalid Username"
    })
    
    else {

        if (user_check.password === password) {

            const user = {
                name: username
            }

            const access_token = newAccessToken(user)
            const refersh_token = jwt.sign(user, process.env.REFRESH_TOKEN_KEY)

            response.json({
                status: true,
                message: "Valid User",
                access_token: access_token,
                refersh_token: refersh_token,
                user_data: user_check
            })
        }

        else response.json({
            status: false,
            message: "Invalid Password"
        })

    }

})

UserRouter.post('/test/', authentication, async(request, response) => {
    console.log(request.body)
    console.log(request.user)

    response.json("Success")
})


export default UserRouter
