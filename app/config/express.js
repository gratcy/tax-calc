/* global CONFIG, env */

'use strict'

const compression = require('compression')()
const bodyParser = require('body-parser')
const async = require('async')
const path = require('path')
const expressValidator = require('express-validator')
const xssFilter = require('x-xss-protection')()
const nocache = require('nocache')()
const uuidV4 = require('uuid/v4')

const parallelMiddleware = middlewares => (req, res, next) => async.each(middlewares, (mw, cb) => mw(req, res, cb), next)

module.exports = (app, rollbar) => {
  app.set('env', env)
  app.set('port', CONFIG.SERVER.PORT)

  app.use(parallelMiddleware([
    xssFilter,
    nocache,
    bodyParser.json({limit: '2mb'}),
    bodyParser.urlencoded({extended: true, limit: '2mb', parameterLimit: 1000}),
    compression,
    expressValidator()
  ]))

  require(CONFIG.ROOT + '/app/routes')(app)

  app.use((err, req, res, next) => {
    if (err.message && (~err.message.indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next()
    }
    const errorResults = {}

    errorResults.message = err.stack
    errorResults.status = 500
    errorResults.id = uuidV4()

    return res.status(500).send(errorResults)
  })

  // assume 404 since no middleware responded
  app.use((req, res, next) => {
    const errorResults = {}

    errorResults.id = uuidV4()
    errorResults.message = 'Sorry, that page does not exist'
    errorResults.status = 404 // Corresponds with an HTTP 404 - the specified resource was not found.
    return res.status(404).json(errorResults)
  })
}
