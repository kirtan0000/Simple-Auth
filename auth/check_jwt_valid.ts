const check_jwt_valid = (token: string) => {
  const enviromentVars = require("dotenv").config().parsed;
  const jwt = require("jsonwebtoken");
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
