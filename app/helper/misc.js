'use strict'

const uuidV4 = require('uuid/v4')

module.exports = {
  errorCustomStatus: (res, err, status) => {
    let resultPrint = {}
    resultPrint.id = uuidV4()
    resultPrint.status = _.result(err, 'status') || 400
    resultPrint.errors = {}

    if (_.isNil(status) && _.isObject(err)) {
      resultPrint.errors.message = _.result(err, 'message') || _.result(err, 'msg') || 'Bad Request'
      resultPrint.errors.fields = err
    } else {
      resultPrint.status = status || resultPrint.status
      resultPrint.message = err
      resultPrint.errors.message = err || 'The server encountered an unexpected condition which prevented it from fulfilling the request.'
    }

    return res.status(resultPrint.status).json(resultPrint)
  },
  notFound: (res, message) => {
    let resultPrint = {}
    resultPrint.id = uuidV4()
    resultPrint.errors = {
      message: message || 'Sorry, that page does not exist'
    }
    resultPrint.status = 404
    return res.status(404).json(resultPrint)
  },
  responses: (res, obj, status, extra) => {
    var resultPrint = {}

    resultPrint.id = uuidV4()
    resultPrint.status = status || 201

    if (_.isObject(obj)) {
      resultPrint.data = obj
    } else {
      resultPrint.message = obj
    }

    if (_.isObject(extra)) {
      Object.assign(resultPrint, extra)
    }

    return res.status(resultPrint.status).json(resultPrint)
  },
  itemCalculation: (code, price) => {
    let priceItem = parseFloat(price)
    let tax = 0
    let isRefundable = true
    let type = 'Food'
    
    if (code === 1) {
      tax = priceItem * 0.1
      isRefundable = true
      type = 'Food'
    } else if (code === 2) {
      tax = 10 + (priceItem * 0.02)
      isRefundable = false
      type = 'Food'
    } else {
      if (priceItem < 100) {
        tax = 0
      } else {
        tax = (priceItem - 100) * 0.01
      }
      type = 'Entertainment'
    }

    const data = {
      tax: tax,
      isRefundable: isRefundable,
      type: type,
      amount: priceItem + tax
    }

    return data
  }
}
