import nodemailer from "nodemailer";
const enviromentVars = require("dotenv").config().parsed;

const send_email = async (address: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: enviromentVars._email_name_.toString(),
      pass: enviromentVars.__password__.toString(),
    },
  });
  let email_sent = await transporter.sendMail({
    from: enviromentVars._email_name_.toString(),
    to: address,
    subject: "Welcome To EXAMPLE_SITE!",
    html: `<center>
      <h1>Welcome To EXAMPLE_SITE</h1>
      <h2>Get Started With EXAMPLE_SITE!</h2>
      <a href="https://example.com">Take Me There!</a>
      </center>
      `,
  });
  if (email_sent) return true;
};

export default send_email;
