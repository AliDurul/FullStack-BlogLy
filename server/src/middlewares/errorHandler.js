"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// app.use(errorHandler):

module.exports = (err, req, res, next) => {

    return res.status(err?.statusCode || res.errorStatusCode || 500).send({
        error: true,
        message: err.message,
        cause: err.cause,
        body: req.body,
        stack: err.stack
    });
}