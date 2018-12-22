/* global ItemControllers */
'use strict'

var Route = express.Router()

Route
  .get('/get', ItemControllers.get)
  .post('/create', ItemControllers.create)
  .post('/update/:itemId', ItemControllers.update)
  .get('/delete/:itemId', ItemControllers.delete)

module.exports = Route
