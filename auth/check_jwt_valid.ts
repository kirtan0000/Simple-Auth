// Check if the sent JWT token is valid
const check_jwt_valid = (token: string) => {
  const enviromentVars = require("dotenv").config().parsed;
  const jwt = require("jsonwebtoken");
  // Decode the JWT token and if false, send an error message
  const data = jwt.verify(
    token,
    enviromentVars.JWTKEY.toString(),
    function (err: any, decoded: string) {
      if (!err) return [true, decoded];
      else return [false, null];
    }
  );
  return data;
};

export default check_jwt_valid;
