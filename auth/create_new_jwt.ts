// Creates a new JWT token when it expires
const create_new_jwt = async (refresh_token: string) => {
  const jwt = require("jsonwebtoken");
  const rep = require("../util/replace_sql");
  const run_query = require("../util/run_query");
  const enviromentVars = require("dotenv").config().parsed;
  // Fetch the user refresh token and if not found in database, send error message else create a new JWT token
  let user_refresh = await run_query(rep([refresh_token], "GET/get_user_info.sql"));
  if (!user_refresh.length)
    return { success: false, message: "User Not Found!" };
  else {
    let user_email = user_refresh[0].email;
    let user_name = user_refresh[0].username;
    // Sign the JWT token and set it to expire every 10 minutes; the JWT token contains the email and username of the user
    let new_jwt = jwt.sign(
      { email: user_email, username: user_name },
      enviromentVars.JWTKEY.toString(),
      { expiresIn: 600 } // 10 Mins
    );
    // If couldn't correctly send the new JWT token then send an error message
    try {
      return { success: true, new_jwt };
    } catch (error) {
      return { success: false, message: "An unknown error occured." };
    }
  }
};

export default create_new_jwt;
