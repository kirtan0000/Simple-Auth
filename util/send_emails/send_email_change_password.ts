import nodemailer from "nodemailer";
const enviromentVars = require("dotenv").config().parsed;

const send_email_change_password = async (address: string) => {
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
    subject: "Your password for EXAMPLE_SITE has been changed.",
    html: `<center>
          <h2> Your password for EXAMPLE_SITE was just changed. </h2>
      </center>
      `,
  });
  if (email_sent) return true;
};

export default send_email_change_password;
