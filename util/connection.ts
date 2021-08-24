import mysql from "mysql";
const enviromentVars = require("dotenv").config().parsed;
import util from "util";
var con;

// Create a new connection with the MySQl database with the given credentials
const create = () => {
  con = mysql.createPool({
    user: enviromentVars.USER.toString(),
    password: enviromentVars.PASSWORD.toString(),
    database: enviromentVars.DATABASE.toString(),
  });
  con.getConnection(() => {});
  con.query = util.promisify(con.query); // Prevent async/await errors
};

export { create, con };
