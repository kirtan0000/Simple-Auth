import mysql from "mysql";
const enviromentVars = require("dotenv").config().parsed;
import { con } from "./connection";

module.exports = async (command: string) => {
  return await con.query(command[0], command[1]);
};
