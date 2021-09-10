import nodemailer from "nodemailer";
const enviromentVars = require("dotenv").config().parsed;

// Notify the user about their account getting deleted
const send_email_delete = async (address: string) => {
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
    subject: "Your account for EXAMPLE_SITE has been deleted.",
    html: `<center>
          <h2> Your account on EXAMPLE_SITE has been permanently deleted.</h2>
          <p> If this wasn't you, <a href="https://example.com/create-user/"> then you can make a new one.</a> </p>
      </center>
      `,
  });
  // For create_user, replace the link with your website URL.
  if (email_sent) return true;
};

export default send_email_delete;
