import nodemailer from "nodemailer";
const enviromentVars = require("dotenv").config().parsed;

// Notify the user about their username change
const send_email_change_username = async (address: string) => {
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
    subject: "Your username for EXAMPLE_SITE has been changed.",
    html: `<center>
          <h2> Your username for EXAMPLE_SITE was just changed. </h2>
          <p> If this wasn't you, <a href="https://example.com/change-username/"> then you can change it again.</a> </p>
      </center>
      `,
  });
  // For change_username, replace the link with your website URL.
  if (email_sent) return true;
};

export default send_email_change_username;
