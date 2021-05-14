const create_new_jwt_new_user = async (email: string, name: string) => {
  const jwt = require("jsonwebtoken");
  const enviromentVars = require("dotenv").config().parsed;
  return jwt.sign(
    { email: email, username: name },
    enviromentVars.JWTKEY.toString(),
    { expiresIn: 600 } // 10 Mins
  );
};

export default create_new_jwt_new_user;
