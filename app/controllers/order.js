'use strict'

const async = require('async')
const orderModel = require('../models/order')
const orderDetailModel = require('../models/order_detail')
const itemsModel = require('../models/items')

exports.get = (req, res) => {
  req.checkHeaders('userid', 'userId is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  async.waterfall([
    (cb) => {
      orderModel.getOrder(req, req.headers.userid, (errOrder, resultOrder) => {
        cb(errOrder, resultOrder)
      })
    },
    (dataOrder, cb) => {
      let priceSubTotal = 0
      let taxSubTotal = 0
      let grandTotal = 0

      const detailOrder = []
      async.eachSeries(dataOrder, (order, nextOrder) => {
        orderDetailModel.getOrderDetail(req, order.id, (errItems, resultItems) => {
          if (errItems) console.error(errItems)

          let calcItems = []
          async.each(resultItems, (item, nextItem) => {
            let itemTmp = _.merge(item, MiscHelper.itemCalculation(_.result(item, 'tax_code', 0), parseFloat(_.result(item, 'price', 0))))

            priceSubTotal += itemTmp.price
            taxSubTotal += itemTmp.tax
            grandTotal += itemTmp.amount

            calcItems.push(itemTmp)
            nextItem()
          }, errItem => {
            order.priceSubTotal = priceSubTotal
            order.taxSubTotal = taxSubTotal
            order.grandTotal = grandTotal
            detailOrder.push(_.merge(order, { items: calcItems }))
            nextOrder(errItem)
          })
        })
      }, errGetItems => {
        cb(errGetItems, detailOrder)
      })
    }
  ], (errGetOrder, resultGetOrder) => {
    if (errGetOrder) {
      return MiscHelper.errorCustomStatus(res, errGetOrder, 400)
    } else {
      return MiscHelper.responses(res, resultGetOrder)
    }
  })
}

exports.getDetail = (req, res) => {
  req.checkHeaders('userid', 'userId is required').notEmpty()
  req.checkParams('orderId', 'orderId is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  async.waterfall([
    (cb) => {
      orderModel.getOrderDetail(req, [req.headers.userid, req.params.orderId], (errOrder, resultOrder) => {
        cb(errOrder, resultOrder)
      })
    },
    (dataOrder, cb) => {
      let priceSubTotal = 0
      let taxSubTotal = 0
      let grandTotal = 0

      orderDetailModel.getOrderDetail(req, dataOrder.id, (errItems, resultItems) => {
        if (errItems) console.error(errItems)

        let calcItems = []
        async.each(resultItems, (item, nextItem) => {
          let itemTmp = _.merge(item, MiscHelper.itemCalculation(_.result(item, 'tax_code', 0), parseFloat(_.result(item, 'price', 0))))

          priceSubTotal += itemTmp.price
          taxSubTotal += itemTmp.tax
          grandTotal += itemTmp.amount

          calcItems.push(itemTmp)
          nextItem()
        }, errItem => {
          dataOrder.priceSubTotal = priceSubTotal
          dataOrder.taxSubTotal = taxSubTotal
          dataOrder.grandTotal = grandTotal

          cb(errItem, _.merge(dataOrder, { items: calcItems }))
        })
      })
    }
  ], (errGetOrder, resultGetOrder) => {
    if (errGetOrder) {
      return MiscHelper.errorCustomStatus(res, errGetOrder, 400)
    } else {
      return MiscHelper.responses(res, resultGetOrder)
    }
  })
}

exports.checkout = (req, res) => {
  req.checkBody('itemIds', 'Item is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const itemIds = req.body.itemIds
  const userId = req.headers.userid || 0

  let priceSubTotal = 0
  let taxSubTotal = 0
  let grandTotal = 0

  async.waterfall([
    (cb) => {
      let orderItems = []

      async.eachSeries(itemIds, (item, nextItem) => {
        itemsModel.getItemDetail(req, item, (errItem, resultItem) => {
          let itemTmp = _.merge(resultItem, MiscHelper.itemCalculation(_.result(resultItem, 'tax_code', 0), parseFloat(_.result(resultItem, 'price', 0))))

          priceSubTotal += itemTmp.price
          taxSubTotal += itemTmp.tax
          grandTotal += itemTmp.amount

          orderItems.push(itemTmp)
          nextItem(errItem)
        })
      }, errLoopItems => {
        cb(errLoopItems, orderItems)
      })
    },
    (orderItems, cb) => {
      const dataOrder = {
        userId: userId,
        orderdate: new Date(),
        duedate: new Date(),
        status: 'unpaid'
      }

      orderModel.insert(req, dataOrder, (errOrder, resultOrder) => {
        cb(errOrder, resultOrder, orderItems)
      })
    },
    (dataOrder, orderItems, cb) => {
      async.eachSeries(orderItems, (item, nextItem) => {
        if (item.id > 0) {
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
        } else {
          nextItem()
        }
      }, errLoopItems => {
        dataOrder.priceSubTotal = priceSubTotal
        dataOrder.taxSubTotal = taxSubTotal
        dataOrder.grandTotal = grandTotal
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
