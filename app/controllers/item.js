'use strict'

const itemsModel = require('../models/items')

exports.get = (req, res) => {
  req.checkHeaders('userid', 'userId is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  itemsModel.getItems(req, (errItems, resultItems) => {
    if (errItems) {
      return MiscHelper.errorCustomStatus(res, errItems, 400)
    } else {
      return MiscHelper.responses(res, resultItems)
    }
  })
}

exports.create = (req, res) => {
  req.checkHeaders('userid', 'userId is required').notEmpty()
  req.checkBody('item_name', 'Item Name is required').notEmpty()
  req.checkBody('tax_code', 'Tax Code is required').notEmpty()
  req.checkBody('price', 'Price is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const dataItem = {
    item_name: req.body.item_name,
    tax_code: req.body.tax_code,
    price: parseFloat(req.body.price),
    status: 'active'
  }

  itemsModel.insert(req, dataItem, (errItemInsert, resultItemInsert) => {
    if (errItemInsert) {
      return MiscHelper.errorCustomStatus(res, errItemInsert, 400)
    } else {
      return MiscHelper.responses(res, resultItemInsert)
    }
  })
}

exports.update = (req, res) => {
  req.checkHeaders('userid', 'userId is required').notEmpty()
  req.checkParams('itemId', 'orderId is required').notEmpty()
  req.checkBody('item_name', 'Item Name is required').notEmpty()
  req.checkBody('tax_code', 'Tax Code is required').notEmpty()
  req.checkBody('price', 'Price is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const dataItem = {
    item_name: req.body.item_name,
    tax_code: req.body.tax_code,
    price: parseFloat(req.body.price)
  }

  itemsModel.update(req, req.params.itemId, dataItem, (errItemUpdated, resultItemUpdated) => {
    if (errItemUpdated) {
      return MiscHelper.errorCustomStatus(res, errItemUpdated, 400)
    } else {
      return MiscHelper.responses(res, resultItemUpdated)
    }
  })
}

exports.delete = (req, res) => {
  req.checkParams('itemId', 'Item ID is required and must be integer value').notEmpty().isInt()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const itemId = req.params.itemId
  const dataItem = {
    status: 'inactive'
  }

  itemsModel.update(req, itemId, dataItem, (errItemDeleted, resultItemDeleted) => {
    if (errItemDeleted) {
      return MiscHelper.errorCustomStatus(res, errItemDeleted, 400)
    }

    if (_.isEmpty(resultItemDeleted)) {
      return MiscHelper.notFound(res, 'Item not found.')
    } else {
      return MiscHelper.responses(res, resultItemDeleted)
    }
  })
}
