"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/user:

const user = require('../controllers/user')

// URL: /users

router.route('/')
    .get(user.list)

router.route('/:id')
    .get(user.read)
    .put(user.update)
    .patch(user.update)
    .delete(user.delete)

/* ------------------------------------------------------- */
// Exports:
module.exports = router