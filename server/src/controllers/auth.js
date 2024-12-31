"use strict"

const User = require('../models/User')
const CustomError = require('../helpers/customError')

const passwordEncrypt = require('../helpers/passwordEncrypt')

const jwt = require('jsonwebtoken')
/* -------------------------------------------------------*/

const generateUsername = async (email) => {
    let username = email.split('@')[0]
    let isUnique = await User.exists({ 'personal_info.username': username })

    isUnique ? username += Math.floor(Math.random() * 1000) : ''
    return username
}

const SetToken = (user) => {

    const { profile_img, username, fullname } = user.personal_info;
    const payload = {
        profile_img,
        username,
        fullname
    };
    // JWT:
    const access = jwt.sign(payload, process.env.ACCESS_KEY, { expiresIn: '30m' })
    const refresh = jwt.sign({ _id: user._id }, process.env.REFRESH_KEY, { expiresIn: '3d' })

    return { error: false, access, refresh }
}


module.exports = {

    login: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get Token and JWT.'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                }
            }
        */

        const { email, password } = req.body

        if (!(email && password)) throw new CustomError('Please enter username/email and password.', 401)

        const user = await User.findOne({ 'personal_info.email': email })

        if (!user) throw new CustomError('User not found.', 404)

        if (user.personal_info.password !== passwordEncrypt(password)) throw new CustomError('Wrong username/email or password.', 401)



        res.status(200).send(SetToken(user))

    },

    register: async (req, res) => {
        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create User"
            #swagger.description = `
                Password Format Type: It must has min.1 lowercase, min.1 uppercase, min.1 number and min.1 specialChars.
            `
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "firstName": "test",
                    "lastName": "test",
                }
            }
        */

        const { fullname, email, password } = req.body

        let user;

        if (req.body.sub) {
            const { sub, fullname, email, picture, } = req.body;

            user = await User.findOne({ _id: sub });

            if (user) return;

            user = await User.create({ _id: sub, OAuth: true, personal_info: { fullname, email, profile_img: picture, username: await generateUsername(email) } })

        } else {

            if (!(fullname && email && password)) throw new CustomError('Please fill all fields.', 400)

            if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) throw new CustomError('Password must be between 6 to 20 characters and include at least one numeric digit, one uppercase and one lowercase letter.', 400)

            const username = await generateUsername(email)

            user = await User.create({ personal_info: { fullname, email, password: passwordEncrypt(password), username } })

        }

        res.status(201).send(SetToken(user))
    },

    refresh: async (req, res) => {
        /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'JWT: Refresh'
            #swagger.description = 'Refresh access-token by refresh-token.'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    bearer: {
                        refresh: '___refreshToken___'
                    }
                }
            }
        */

        const refreshToken = req.body?.bearer?.refreshToken

        if (refreshToken) {

            jwt.verify(refreshToken, process.env.REFRESH_KEY, async function (err, userData) {

                if (err) {

                    res.errorStatusCode = 401
                    throw err
                } else {

                    const { _id, password } = userData

                    if (_id && password) {

                        const user = await User.findOne({ _id })

                        if (user && user.password == password) {

                            if (user.isActive) {

                                // JWT:
                                const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_KEY, { expiresIn: '30m' })

                                res.send({
                                    error: false,
                                    bearer: { accessToken }
                                })

                            } else {

                                res.errorStatusCode = 401
                                throw new Error('This account is not active.')
                            }
                        } else {

                            res.errorStatusCode = 401
                            throw new Error('Wrong id or password.')
                        }
                    } else {

                        res.errorStatusCode = 401
                        throw new Error('Please enter id and password.')
                    }
                }
            })

        } else {
            res.errorStatusCode = 401
            throw new Error('Please enter token.refresh')
        }
    },

    logout: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Token: Logout"
            #swagger.description = 'Delete token-key.'
        */


        res.send({
            error: false,
            message: 'Logout success.',
        })
    },

}