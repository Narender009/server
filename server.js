const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Updated CORS configuration to be more permissive during development
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URL
  methods: ['POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept']
}));

app.use(express.json());

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'rainarender009@gmail.com',
    pass: process.env.EMAIL_PASS || 'cmdsvupzmrkrlzze'
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Email server is running');
});

// Email sending route
app.post('/send-email', async (req, res) => {
  const { name, subject, email, message } = req.body;
  
  if (!name || !subject || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: `"Contact Form" <${process.env.EMAIL_USER || 'rainarender009@gmail.com'}>`,
    to: process.env.EMAIL_USER || 'rainarender009@gmail.com',
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

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});