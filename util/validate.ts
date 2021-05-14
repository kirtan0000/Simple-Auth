const passwordHash = require("password-hash");

const validateEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(email).toLowerCase()
  );
const containsSpecialChars = (char: string) =>
  /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(char);
const verifyHash = (pass: string, hash: string) =>
  passwordHash.verify(pass, hash);

const valid_name = (name: string) => name.match(/^[0-9a-zA-Z]+$/);

module.exports = {
  validateEmail,
  containsSpecialChars,
  verifyHash,
  valid_name,
};
