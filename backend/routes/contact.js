import express from 'express';
import Contact from '../models/contactModel.js';
import { sendContactEmail } from '../nodemailer/email.js';


const router = express.Router();


router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate request body
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    await sendContactEmail(name, email, message);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    return res.status(500).json({ error: 'Failed to create contact' });
  }
})

export default router;