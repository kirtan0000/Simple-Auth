import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const passwordHash = require("password-hash");
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import create_new_jwt_new_user from "../auth/create_new_jwt_new_user";
import send_email from "../util/send_email";
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

router.post("/create-user", async (req: Request, res: Response) => {
  let email = req.body?.email;
  const password = req.body?.password;
  const name = req.body?.username;

  if (email === undefined || password === undefined || name === undefined) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }
  if (valid_name(name)) {
    if (
      validateEmail(email) &&
      password.length >= 8 &&
      containsSpecialChars(password)
    ) {
      const hashed_pass = passwordHash.generate(password);
      const user_refresh = await generate_refresh();
      const user_exists = await check_user_exists(email, name);
      const new_jwt = await create_new_jwt_new_user(email, name);
      if (user_exists) {
        res.json({ success: false, message: "The user already exists." });
        return;
      }
      await run_query(
        rep([name, email, hashed_pass, user_refresh], "add_user.sql")
      );
      send_email(email);
      res.json({
        success: true,
        message: "Success!",
        data: {
          jwt_token: new_jwt,
          refresh_token: user_refresh,
        },
      });
    } else if (!validateEmail(email))
      res.json({
        success: false,
        message: "Please enter a valid email.",
      });
    else if (password.length < 8 || !containsSpecialChars(password))
      res.json({
        success: false,
        message:
          "Please enter a password that is at least 8 characters and has at least 1 special character.",
      });
  } else
    res.json({
      success: false,
      message: "The username is invalid.",
    });
});

router.post("/login", async (req: Request, res: Response) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (email === undefined || password === undefined) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }

  const user_exists = await check_user_exists_by_login(email);

  if (!user_exists[0]) {
    res.json({ success: false, message: "The user does not exist." });
    return;
  }

  const user_info = user_exists[1][0];
  const hashedPass = user_info.password;
  const refresh_token = user_info.refresh;
  const isValid = passwordHash.verify(password, hashedPass);
  if (!isValid) {
    res.json({ success: false, message: "The password is incorrect." });
    return;
  }
  const new_jwt = await create_new_jwt(refresh_token);
  res.json({
    success: true,
    message: "Success!",
    data: {
      refresh_token: refresh_token,
      jwt_token: new_jwt.new_jwt,
    },
  });
});

module.exports = router;
