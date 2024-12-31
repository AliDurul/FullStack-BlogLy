"use strict"


const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {

    const auth = req.headers?.authorization || null
    const tokenKey = auth ? auth.split(' ') : null

    if (tokenKey) {
        if (tokenKey[0] == 'Bearer') { // JWT
            jwt.verify(tokenKey[1], process.env.ACCESS_KEY, (err, userData) => req.user = userData)
        }
    }

    next()
}