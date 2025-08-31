const nodemailer = require("nodemailer");

const mail = process.env.OTP_MAIL
const pass = process.env.OTP_PASS
console.log(mail, pass);

// Setup the Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rahulnama0807@gmail.com",
    pass: "jsycwimjvtdoouco",   
  },
});


const sentOtpEmail = async (to, otp, name) => {
  try {
    await transporter.sendMail({
      from: mail,
      to: to,
      subject: "Your OTP for Account Verification",
      text: `Hello ${name} , Your OTP for account verification is: ${otp}. It will expire in 10 minutes.`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ,</h2>
          <p>Your verification code is:</p>
          <h1 style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = sentOtpEmail;
