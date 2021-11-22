import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const passwordHash = require("password-hash");
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import send_email_change_username from "../util/send_emails/send_email_change_username";
import create_new_jwt from "../auth/create_new_jwt";
import check_user_exists_by_login from "../auth/check_user_exists_by_login";
import check_user_exists from "../auth/check_user_exists";

const { valid_name } = require("../util/validate");

// The change user name route
router.post("/change-username", async (req: Request, res: Response) => {
  let email = req.body?.email;
  const password = req.body?.password;
  let new_username = req.body?.new_username;

  // If any body data is missing then send an error message
  if (
    email === undefined ||
    password === undefined ||
    new_username === undefined
  ) {
    res.status(401).json({
      success: false,
      message: "Missing valid credentials.",
      status_code: 401,
    });
    return;
  }

  const user_exists = await check_user_exists_by_login(email); // Check if the user exists from their email

  if (user_exists[1][0].username == new_username) {
    // If the new name is the same as the old name, throw an error
    res.status(409).json({
      success: false,
      message: "New username can't be same as old one.",
      status_code: 409,
    });
    return;
  }

  if (!user_exists[0]) {
    res.status(404).json({
      success: false,
      message: "The user does not exist.",
      status_code: 404,
    });
    return;
  }

  // Check if user with that name already exists
  const new_user_already_exists = await check_user_exists("non-existent", new_username); // Had to put "non-existent" because this file also checks if the email exists, but we already know it does
  if (new_user_already_exists) {
    res.status(409).json({
      success: false,
      message: "A user with this name already exists. Try a different one",
      status_code: 409,
    });
    return;
  }

  // Get the user info and check if the inputted password's hash matches the correct password's hash
  const user_info = user_exists[1][0];

  const hashedPass = user_info.password;
  const isValid = passwordHash.verify(password, hashedPass);

  if (!isValid) {
    res.status(403).json({
      success: false,
      message: "The password is incorrect.",
      status: 403,
    });
    return;
  }

  // Validate the new username
  if (valid_name(new_username)) {
    // Update the username in the database
    await run_query(rep([new_username, email], "UPDATE/update_user_name.sql"));
    send_email_change_username(email); // Notify the user about their username change
    res.status(200).json({
      success: true,
      message: "Success!",
      status_code: 200,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Please enter a valid username without special characters.",
      status_code: 400,
    });
  }
});

export default router;
