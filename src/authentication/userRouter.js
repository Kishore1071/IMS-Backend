import express from 'express'
import { User } from './userModel.js'
import crypto from 'crypto'

const UserRouter = express.Router()

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

    console.log(user_check)

    if (user_check === undefined) response.json({
        status: false,
        message: "Invalid Username"
    })
    
    else {

        if (user_check.password === password) response.json({
            status: true,
            message: "Valid User"
        })

        else response.json({
            status: false,
            message: "Invalid Password"
        })

    }

})

export default UserRouter
