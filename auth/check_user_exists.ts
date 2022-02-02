const rep = require('../util/replace_sql')
const run_query = require('../util/run_query')

// Check if the user exists at the sign up screen
const check_user_exists = async (email: string, name: string) => {
  // If the user info is found in the database return true; if not return false
  const user_inf = await run_query(
    rep([name, email], 'GET/check_user_exists.sql')
  )
  if (!!user_inf.length) return true
  else return false
  return true
}

export default check_user_exists
