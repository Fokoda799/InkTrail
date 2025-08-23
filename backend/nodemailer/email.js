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

async function sendContactEmail(name, email, message) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    html: `<p>You have received a new message from the contact form:</p>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong> ${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact email sent to ${process.env.CONTACT_EMAIL}`);
  } catch (error) {
    console.error(`Error sending contact email: ${error.message}`);
  }
}

export { sendVerificationEmail, sendWelcomeEmail, sendContactEmail };
