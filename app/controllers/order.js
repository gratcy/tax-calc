'use strict'

const async = require('async')
const orderModel = require('../models/order')
const orderDetailModel = require('../models/order_detail')
const itemsModel = require('../models/items')

exports.get = (req, res) => {
  req.checkParams('userId', 'userId is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  return MiscHelper.responses(res, req.params)
}

exports.checkout = (req, res) => {
  req.checkBody('itemIds', 'Item is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const itemIds = req.body.itemIds
  const userId = req.headers.userid || 0

  async.waterfall([
    (cb) => {
      let totalPrice = 0
      let orderItems = []

      async.eachSeries(itemIds, (item, nextItem) => {
        itemsModel.getItemDetail(req, item, (errItem, resultItem) => {
          totalPrice += MiscHelper.itemCalculation(_.result(resultItem, 'tax_code', 0), parseFloat(_.result(resultItem, 'price', 0))).amount
          orderItems.push(resultItem)
          nextItem(errItem)
        })
      }, errLoopItems => {
        cb(errLoopItems, totalPrice, orderItems)
      })
    },
    (totalPrice, orderItems, cb) => {
      const dataOrder = {
        userId: userId,
        orderdate: new Date(),
        duedate: new Date(),
        total: totalPrice,
        status: 'unpaid'
      }

      orderModel.insert(req, dataOrder, (errOrder, resultOrder) => {
        cb(errOrder, resultOrder, orderItems)
      })
    },
    (dataOrder, orderItems, cb) => {
      async.eachSeries(orderItems, (item, nextItem) => {
        let dataOrderDetail = {
          order_id: dataOrder.id,
          item_id: item.id,
          price: item.price,
          tax_code: item.tax_code,
          status: 'active'
        }

        orderDetailModel.insert(req, dataOrderDetail, (errOrderDetail, resultOrderDetail) => {
          nextItem(errOrderDetail)
        })
      }, errLoopItems => {
        cb(errLoopItems, dataOrder, orderItems)
      })
    }
  ], (errCheckout, resultDataOrder, resultOrderItems) => {
    if (errCheckout) {
      return MiscHelper.errorCustomStatus(res, errCheckout, 400)
    } else {
      return MiscHelper.responses(res, _.merge(resultDataOrder, { items: resultOrderItems }))
    }
  })
}
