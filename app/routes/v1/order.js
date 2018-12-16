'use strict'

var Route = express.Router()

Route
  .post('/checkout', OrderControllers.checkout)

module.exports = Route
