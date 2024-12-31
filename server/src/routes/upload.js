"use strict"

const router = require('express').Router()
const generateUploadUrl = require('../helpers/generateUploadUrl')
/* ------------------------------------------------------- */

router.route('/').get(async (req, res) => {

    const url = await generateUploadUrl()

    if (!url) return res.status(500).json({ error: true, message: url.message })

    res.status(200).json({ uploadURL: url })

})


/* ------------------------------------------------------- */
// Exports:
module.exports = router