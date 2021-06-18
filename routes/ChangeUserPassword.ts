import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const passwordHash = require("password-hash");
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import send_email_change_password from "../util/send_emails/send_email_change_password";
import create_new_jwt from "../auth/create_new_jwt";
import check_user_exists_by_login from "../auth/check_user_exists_by_login";

const { containsSpecialChars, verifyHash } = require("../util/validate");

router.post("/change-user-password", async (req: Request, res: Response) => {
  let email = req.body?.email;
  const password = req.body?.password;
  const new_password = req.body?.new_password;

  if (
    email === undefined ||
    password === undefined ||
    new_password === undefined
  ) {
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
  const isValid = passwordHash.verify(password, hashedPass);
  if (!isValid) {
    res.json({ success: false, message: "The password is incorrect." });
    return;
  }

  if (new_password.length >= 8 && containsSpecialChars(new_password)) {
    const hashed_pass_new = passwordHash.generate(new_password);

    await run_query(
      rep([hashed_pass_new, email], "UPDATE/update_user_password.sql")
    );
    send_email_change_password(email);
    res.json({
      success: true,
      message: "Success!",
    });
  } else if (new_password.length < 8 || !containsSpecialChars(new_password))
    res.json({
      success: false,
      message:
        "Please enter a new password that is at least 8 characters and has at least 1 special character.",
    });
});

module.exports = router;
