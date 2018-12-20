'use strict'

module.exports = {
  getOrderDetail: (conn, orderId, callback) => {
    conn.getConnection((errConnection, connection) => {
      connection.query(`SELECT a.price,a.tax_code,b.item_name from order_detail_tab a LEFT JOIN items_tab b ON a.item_id=b.id WHERE a.status='active' AND a.order_id = ?`, orderId, (err, rows) => {
        callback(err, rows)
      })
    })
  },
  insert: (conn, data, callback) => {
    conn.getConnection((errConnection, connection) => {
      if (errConnection) console.error(errConnection)

      connection.query('INSERT INTO order_detail_tab SET ? ', data, (err, rows) => {
        if (err) {
          callback(err)
        } else {
          callback(null, _.merge(data, { id: rows.insertId }))
        }
      })
    })
  },
  update: (conn, id, data, callback) => {
    conn.getConnection((errConnection, connection) => {
      if (errConnection) console.error(errConnection)

      connection.query('UPDATE order_detail_tab SET ? WHERE id = ? ', [data, id], (errUpdate, resultUpdate) => {
        callback(errUpdate, resultUpdate.affectedRows > 0 ? _.merge(data, { id: id }) : [])
      })
    })
  }
}
