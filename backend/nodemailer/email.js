import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { html, createVerificationEmailPlainText } from '../templates/emailVerification.js';
import { createWelcomeEmailTemplate, createWelcomeEmailPlainText } from '../templates/welcomeEmail.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use true for port 465
  auth: {
    user: 'feyt2003@gmail.com',
    pass: process.env.SMTP_PASS, // from .env
  },
  tls: {
    rejectUnauthorized: false, // useful for local dev
  },
});

async function sendVerificationEmail(user, verificationToken) {

  const message = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Verify Your InkTrail Account - Welcome to Our Community!',
    html: html(user, verificationToken), // HTML content
    text: createVerificationEmailPlainText(user, verificationToken), // Plain text content
  };

  try {
    await transporter.sendMail(message);
    console.log(`Verification email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending verification email: ${error.message}`);
  }
}

async function sendWelcomeEmail(user) {
  const message = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Welcome to InkTrail - Your Writing Journey Begins Now! 🎉',
    html: createWelcomeEmailTemplate(user.username), // HTML content
    text: createWelcomeEmailPlainText(user.username), // Plain text content
  };

  try {
    await transporter.sendMail(message);
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending welcome email: ${error.message}`);
  }

}

export { sendVerificationEmail, sendWelcomeEmail };
