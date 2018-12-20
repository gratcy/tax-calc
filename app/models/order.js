'use strict'

module.exports = {
  getOrder: (conn, userId, callback) => {
    conn.getConnection((errConnection, connection) => {
      connection.query('SELECT * from order_tab WHERE userid = ? ORDER BY id DESC', userId, (err, rows) => {
        callback(err, rows)
      })
    })
  },
  getOrderDetail: (conn, data, callback) => {
    conn.getConnection((errConnection, connection) => {
      connection.query('SELECT * from order_tab WHERE userid = ? AND id = ?', data, (err, rows) => {
        callback(err, _.result(rows, '[0]', {}))
      })
    })
  },
  insert: (conn, data, callback) => {
    conn.getConnection((errConnection, connection) => {
      if (errConnection) console.error(errConnection)

      connection.query('INSERT INTO order_tab SET ? ', data, (err, rows) => {
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

      connection.query('UPDATE order_tab SET ? WHERE id = ? ', [data, id], (errUpdate, resultUpdate) => {
        callback(errUpdate, resultUpdate.affectedRows > 0 ? _.merge(data, { id: id }) : [])
      })
    })
  }
}
