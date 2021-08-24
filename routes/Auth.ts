import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const passwordHash = require("password-hash");
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import create_new_jwt_new_user from "../auth/create_new_jwt_new_user";
import send_email from "../util/send_emails/send_email";
import create_new_jwt from "../auth/create_new_jwt";
import generate_refresh from "../auth/generate_refresh";
import check_user_exists from "../auth/check_user_exists";
import check_user_exists_by_login from "../auth/check_user_exists_by_login";

const {
  validateEmail,
  containsSpecialChars,
  verifyHash,
  valid_name,
} = require("../util/validate");

// The create new user route
router.post("/create-user", async (req: Request, res: Response) => {
  let email = req.body?.email;
  const password = req.body?.password;
  const name = req.body?.username;

  // If any body data is missing then send an error message
  if (email === undefined || password === undefined || name === undefined) {
    res.status(401).json({
      success: false,
      message: "Missing valid credentials.",
      status_code: 401,
    });
    return;
  }
  // If the requested username, email, and password meeet all the requirements (no special characters in username, password must be at least 8 characters, and the password contains special characters) then continue on, else send an error message
  if (valid_name(name)) {
    if (
      validateEmail(email) &&
      password.length >= 8 &&
      containsSpecialChars(password)
    ) {
      // First check if the user exists already, if not then create a password hash and a refresh token for the user
      const hashed_pass = passwordHash.generate(password);
      const user_refresh = await generate_refresh();
      const user_exists = await check_user_exists(email, name);
      const new_jwt = await create_new_jwt_new_user(email, name);
      // If the user exists then send an error message
      if (user_exists) {
        res.status(409).json({
          success: false,
          message: "The user already exists.",
          status_code: 409,
        });
        return;
      }
      // Add the user to the database
      await run_query(
        rep([name, email, hashed_pass, user_refresh], "ADD/add_user.sql")
      );
      send_email(email); // Send the welcome email to the user
      res.status(200).json({
        success: true,
        message: "Success!",
        data: {
          jwt_token: new_jwt,
          refresh_token: user_refresh,
        },
        status_code: 200,
      });
    } else if (!validateEmail(email))
      res.status(400).json({
        success: false,
        message: "Please enter a valid email.",
        status_code: 400,
      });
    else if (password.length < 8 || !containsSpecialChars(password))
      res.status(400).json({
        success: false,
        message:
          "Please enter a password that is at least 8 characters and has at least 1 special character.",
        status_code: 400,
      });
  } else
    res.status(400).json({
      success: false,
      message: "The username is invalid.",
      status_code: 400,
    });
});

// The login route
router.post("/login", async (req: Request, res: Response) => {
  const email = req.body?.email;
  const password = req.body?.password;

  // If any body data is missing then send an error message
  if (email === undefined || password === undefined) {
    res.status(401).json({
      success: false,
      message: "Missing valid credentials.",
      status_code: 401,
    });
    return;
  }

  const user_exists = await check_user_exists_by_login(email); // Check if the user exists from their email

  if (!user_exists[0]) {
    res.status(404).json({
      success: false,
      message: "The user does not exist.",
      status_code: 404,
    });
    return;
  }

  // Get the user info and check if the inputted password's hash matches the correct password's hash
  const user_info = user_exists[1][0];
  const hashedPass = user_info.password;
  const refresh_token = user_info.refresh;
  const isValid = passwordHash.verify(password, hashedPass);
  if (!isValid) {
    res.status(403).json({
      success: false,
      message: "The password is incorrect.",
      status_code: 403,
    });
    return;
  }
  // Create a new JWT token and assign it to the user by their refresh token
  const new_jwt = await create_new_jwt(refresh_token);
  res.status(200).json({
    success: true,
    message: "Success!",
    data: {
      refresh_token: refresh_token,
      jwt_token: new_jwt.new_jwt,
    },
    status_code: 200,
  });
});

module.exports = router;
