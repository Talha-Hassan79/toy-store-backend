const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function testSMTP() {
  console.log("Testing SMTP connection with settings:");
  console.log(`Host: ${process.env.MAIL_HOST}`);
  console.log(`Port: ${process.env.MAIL_PORT}`);
  console.log(`User: ${process.env.MAIL_USER}`);

  if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error("❌ ERROR: Missing environment variables! Check your .env file.");
      return;
  }

  const mailPort = parseInt(process.env.MAIL_PORT || '465');
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: mailPort,
    secure: mailPort === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("------------------------------------------");
    console.log("✅ SMTP Connection successful!");
    console.log("------------------------------------------");
    console.log("You can now send real emails!");
  } catch (error) {
    console.log("------------------------------------------");
    console.log("❌ SMTP Connection failed!");
    console.error(error.message);
    console.log("------------------------------------------");
  }
}

testSMTP();
