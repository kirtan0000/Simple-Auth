import { con } from "./connection";

// Replace the data in an SQL query with dynamic data from the contents of the '/sql' folder
module.exports = (data: Array<string>, file: string) => {
  const fs = require("fs");
  const path = require("path");
  let query = fs
    .readFileSync(path.join(__dirname, `../sql/${file}`))
    .toString();
  return [query, data]; // Return the new query and the data that replaced it
};
