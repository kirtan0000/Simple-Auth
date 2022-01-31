import mysql from 'mysql'
const enviromentVars = require('dotenv').config().parsed
import util from 'util'
var con

// Create a new connection with the MySQl database with the given credentials
const create = () => {
  con = mysql.createPool({
    user: enviromentVars.USER.toString(),
    password: enviromentVars.PASSWORD.toString(),
    database: enviromentVars.DATABASE.toString()
  })
  con.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.')
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.')
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.')
      }
    }

    if (connection) connection.release()

    return
  })
  con.query = util.promisify(con.query) // Prevent async/await errors
}

export { create, con }
