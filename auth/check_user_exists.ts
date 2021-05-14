const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");

const check_user_exists = async (email: string, name: string) => {
  const user_inf = await run_query(rep([name, email], "check_user_exists.sql"));
  if (user_inf.toString()) return true;
  else return false;
  return true;
};

export default check_user_exists;
