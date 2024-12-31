"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */


// auth:
router.use('/auth', require('./auth'))
// // user:
router.use('/users', require('./user'))
// upload image
router.use('/upload-url', require('./upload'))



// // document:
// router.use('/documents', require('./document'))

/* ------------------------------------------------------- */
module.exports = router