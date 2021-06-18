const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");

const check_user_exists_by_login = async (email: string) => {
  const user_inf = await run_query(rep([email], "GET/get_user_info_login.sql"));
  if (user_inf.toString()) return [true, user_inf];
  else return [false, null];
};

export default check_user_exists_by_login;
