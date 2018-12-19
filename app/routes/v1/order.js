/* global OrderControllers */
'use strict'

var Route = express.Router()

Route
  .get('/get/:userId', OrderControllers.get)
  .post('/checkout', OrderControllers.checkout)

module.exports = Route
