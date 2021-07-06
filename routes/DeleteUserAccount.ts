import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const passwordHash = require("password-hash");
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import send_email_delete from "../util/send_emails/send_email_delete";
import generate_refresh from "../auth/generate_refresh";
import check_user_exists_by_login from "../auth/check_user_exists_by_login";

router.post("/delete-user-account", async (req: Request, res: Response) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (email === undefined || password === undefined) {
    res
      .status(401)
      .json({
        success: false,
        message: "Missing valid credentials.",
        status_code: 401,
      });
    return;
  }

  const user_exists = await check_user_exists_by_login(email);

  if (!user_exists[0]) {
    res.status(404).json({ success: false, message: "The user does not exist.", status_code: 404 });
    return;
  }

  const user_info = user_exists[1][0];
  const hashedPass = user_info.password;
  const refresh_token = user_info.refresh;
  const isValid = passwordHash.verify(password, hashedPass);
  if (!isValid) {
    res.status(403).json({
      success: false,
      message: "The password is incorrect. Please try again",
      status_code: 403
    });
    return;
  }
  await run_query(rep([email], "DELETE/delete_user.sql"));
  send_email_delete(email);
  res.status(200).json({
    success: true,
    message: "Success!",
    status_code: 200
  });
});

module.exports = router;
