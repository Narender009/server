const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://portfolio-blond-two-46.vercel.app/'],
  methods: ['POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept']
}));

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'rainarender009@gmail.com',
    pass: process.env.EMAIL_PASS || 'cmdsvupzmrkrlzze'
  }
});

app.get('/', (req, res) => {
  res.send('Email server is running');
});

app.post('/send-email', async (req, res) => {
  const { name, subject, email, message } = req.body;
  
  if (!name || !subject || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Original email to you
  const mainMailOptions = {
    from: `"Contact Form" <${process.env.EMAIL_USER || 'rainarender009@gmail.com'}>`,
    to: 'rainarender1997@gmail.com',
    replyTo: email,
    subject: `New Contact Form Message: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `
  };

  // Auto-reply email to sender
  const autoReplyOptions = {
    from: `"Narender Rai" <${process.env.EMAIL_USER || 'rainarender009@gmail.com'}>`,
    to: email,
    subject: 'Thank you for contacting me',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for reaching out!</h2>
        <p>Dear ${name},</p>
        <p>I've received your message regarding "${subject}" and I appreciate you taking the time to contact me.</p>
        <p>This is an automatic confirmation that your message has been received. I will review your email and get back to you as soon as possible.</p>
        <p>For your reference, here's a copy of your message:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <p>Best regards,</p>
        <p><strong>Narender Rai</strong></p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">This is an automated response. Please do not reply to this email.</p>
      </div>
    `
  };

  try {
    // Send both emails
    await Promise.all([
      transporter.sendMail(mainMailOptions),
      transporter.sendMail(autoReplyOptions)
    ]);
    
    console.log('Emails sent successfully');
    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ 
      error: 'Failed to send emails', 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});