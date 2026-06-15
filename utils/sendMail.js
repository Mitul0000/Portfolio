//This module takes subject,html for the body of the email and the user whom the email has to be send and it uses node mailer to send mails.

const nodemailer = require("nodemailer")
require("dotenv").config()

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

exports.sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })
    console.log("Email sent successfully:", info.response)
  } catch (err) {
    console.error("Error sending email:", err)
    throw err
  }
}