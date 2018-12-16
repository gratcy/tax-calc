'use strict'

const async = require('async')

exports.get = (req, res) => {

}

exports.checkout = (req, res) => {
  req.checkBody('name', 'Name is required').notEmpty()
  req.checkBody('tax_code', 'Tax code is required').notEmpty()
  req.checkBody('price', 'Price is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const taxCode = parseInt(req.body.tax_code)
  const price = req.body.price
  const name = req.body.name

  return MiscHelper.responses(res, _.merge(req.body, MiscHelper.itemCalculation(taxCode, price)))
}
