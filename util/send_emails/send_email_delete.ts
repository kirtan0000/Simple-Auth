import nodemailer from "nodemailer";
const enviromentVars = require("dotenv").config().parsed;

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
          <h2> Your account on EXAMPLE_SITE has been permanently deleted. If this wasn't you then you can create the same account but with a different password. </h2>
      </center>
      `,
  });
  if (email_sent) return true;
};

export default send_email_delete;
