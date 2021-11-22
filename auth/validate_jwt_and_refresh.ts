import express, { Request, Response } from "express";
const router = express.Router();
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import create_new_jwt from "./create_new_jwt";
import check_jwt_valid from "./check_jwt_valid";

const validate_jwt_and_refresh = async (jwt: any, refresh: string) => {
  const isJwtValid = check_jwt_valid(jwt); // Check if the JWT is valid
  if (!isJwtValid[0]) {
    const new_jwt = await create_new_jwt(refresh); // Create a new JWT token from the refresh token
    // Failure to create JWT
    if (!new_jwt.success) {
      return { error: true, message: new_jwt.message };
    }
    return {
      error: false,
      needs_new_jwt: true,
      new_jwt: new_jwt.new_jwt,
      username: check_jwt_valid(new_jwt.new_jwt)[1].username,
    };
  } else { // If no error
    return { error: false, username: isJwtValid[1].username };
  }
};

export default validate_jwt_and_refresh;
