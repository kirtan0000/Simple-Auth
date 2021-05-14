import { con } from "./connection";

module.exports = (data: Array<string>, file: string) => {
  const fs = require("fs");
  const path = require("path");
  let query = fs
    .readFileSync(path.join(__dirname, `../sql/${file}`))
    .toString();
  return [query, data];
};
