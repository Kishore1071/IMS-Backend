import express, { response } from 'express'
import { User, RefreshToken } from './userModel.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { authentication, newAccessToken } from './authentication.js'

const UserRouter = express.Router()

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

let refresh_tokens = []


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
            const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_KEY)

            const new_refresh_token = new RefreshToken({
                refresh_token: refresh_token
            })

            await new_refresh_token.save()

            response.json({
                status: true,
                message: "Valid User",
                access_token: access_token,
                refresh_token: refresh_token,
                user_data: user_check
            })
        }

        else response.json({
            status: false,
            message: "Invalid Password"
        })

    }

})

UserRouter.post('/token/', async(request, response) => {

    const refresh_token = request.body.refresh_token
    
    if (refresh_token === null) {
        return response.status(401).json("No token found")
    }

    const all_refresh_tokens = await RefreshToken.find({refresh_token: refresh_token})

    console.log(all_refresh_tokens, "all_refresh_tokens")

    if (all_refresh_tokens.length > 0) {
        
        return response.status(403).json("Invalid Token")
    }

    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_KEY, (error, user) => {
        
        if (error) {
            return response.status(403).json("Token Verification Failed")
        }

        const access_token = newAccessToken({name: user.name})
        
        response.json({
            access_token: access_token
        })
    })

})

UserRouter.post('/logout/', async (request, response) => {

    const refresh_token = request.body.refresh_token

    const all_refresh_tokens = await RefreshToken.find({})

    let selected_token = all_refresh_tokens.find(token => token.refresh_token === refresh_token)

    let a = await RefreshToken.findByIdAndDelete(selected_token._id)

    console.log(a)

    response.status(200).json("Refresh Token Deleted")
})

UserRouter.post('/test/', authentication, async(request, response) => {
    console.log(request.body)
    console.log(request.user)

    response.json("Success")
})


export default UserRouter
