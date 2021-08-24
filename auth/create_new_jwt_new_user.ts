// Creates a new JWT token when a new user is created
const create_new_jwt_new_user = async (email: string, name: string) => {
  const jwt = require("jsonwebtoken");
  const enviromentVars = require("dotenv").config().parsed;
  // Sign the JWT token and set it to expire every 10 minutes; the JWT token contains the email and username of the user
  return jwt.sign(
    { email: email, username: name },
    enviromentVars.JWTKEY.toString(),
    { expiresIn: 600 } // 10 Mins
  );
};

export default create_new_jwt_new_user;
