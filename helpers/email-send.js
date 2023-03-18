require("dotenv").config();
const nodemailer = require("nodemailer");

// Getting Nodemailer all setup with the credentials
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com", // "outlook.office365.com"
  port: 587,
  secure: false,
  dnsTimeout: 60000,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

module.exports = async (to, content) => {
  const contacts = {
    from: process.env.MAIL_USER,
    to: to,
  };

  const email = Object.assign({}, content, contacts);

  await transporter.sendMail(email);
};
