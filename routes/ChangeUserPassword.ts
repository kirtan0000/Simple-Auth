import express, { Request, Response } from 'express'
const router = express.Router()
import path from 'path'
const passwordHash = require('password-hash')
const rep = require('../util/replace_sql')
const run_query = require('../util/run_query')
import send_email_change_password from '../util/send_emails/send_email_change_password'
import create_new_jwt from '../auth/create_new_jwt'
import check_user_exists_by_login from '../auth/check_user_exists_by_login'

const { containsSpecialChars, verifyHash } = require('../util/validate')

// The change user password route
router.post('/change-user-password', async (req: Request, res: Response) => {
  let email = req.body?.email
  const password = req.body?.password
  const new_password = req.body?.new_password

  // If any body data is missing then send an error message
  if (
    email === undefined ||
    password === undefined ||
    new_password === undefined
  ) {
    res.status(401).json({
      success: false,
      message: 'Missing valid credentials.',
      status_code: 401
    })
    return
  }

  const user_exists = await check_user_exists_by_login(email) // Check if the user exists from their email

  if (!user_exists[0]) {
    res.status(404).json({
      success: false,
      message: 'The user does not exist.',
      status_code: 404
    })
    return
  }

  // Get the user info and check if the inputted password's hash matches the correct password's hash
  const user_info = user_exists[1][0]
  const hashedPass = user_info.password
  const isValid = passwordHash.verify(password, hashedPass)
  if (!isValid) {
    res.status(403).json({
      success: false,
      message: 'The password is incorrect.',
      status: 403
    })
    return
  }

  // Check if the password already macthes the old one
  const matches_old_password = passwordHash.verify(new_password, hashedPass) // Compare the new password to the hash of the old password
  if (matches_old_password) {
    res.status(409).json({
      success: false,
      error: 'New password CANNOT be same as old one.',
      status_code: 409
    })
    return
  }

  // Validate the new password
  if (new_password.length >= 8 && containsSpecialChars(new_password)) {
    const hashed_pass_new = passwordHash.generate(new_password) // Generate a new password hash for the user
    // Update the password hash in the database
    await run_query(
      rep([hashed_pass_new, email], 'UPDATE/update_user_password.sql')
    )
    send_email_change_password(email) // Notify the user about their password change
    res.status(200).json({
      success: true,
      message: 'Success!',
      status_code: 200
    })
  } else if (new_password.length < 8 || !containsSpecialChars(new_password))
    res.status(400).json({
      success: false,
      message:
        'Please enter a new password that is at least 8 characters and has at least 1 special character.',
      status_code: 400
    })
})

export default router
