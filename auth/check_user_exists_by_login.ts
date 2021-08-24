const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");

// Check if the user exists when at the login screen
const check_user_exists_by_login = async (email: string) => {
  // If the user info is found in the database return true along with the user data; if not return false
  const user_inf = await run_query(rep([email], "GET/get_user_info_login.sql"));
  if (user_inf.toString()) return [true, user_inf];
  else return [false, null];
};

export default check_user_exists_by_login;
