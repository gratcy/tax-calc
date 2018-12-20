/* global OrderControllers */
'use strict'

var Route = express.Router()

Route
  .get('/get', OrderControllers.get)
  .get('/detail/:orderId', OrderControllers.getDetail)
  .post('/checkout', OrderControllers.checkout)

module.exports = Route
