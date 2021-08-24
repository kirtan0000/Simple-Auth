import mysql from "mysql";
const enviromentVars = require("dotenv").config().parsed;
import { con } from "./connection";

// Run the SQL query with the data sent and the query itself
module.exports = async (command: string) => {
  return await con.query(command[0], command[1]);
};
