const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
const url = process.env.MONGO_URL || "mongodb+srv://phanindrareddy310231:Kpreddy%4007@cluster0.ff85q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error', err));

// Define Schemas and Models
const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now }
});

const sendMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
});

const sendEmailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
const SendMessage = mongoose.model('SendMessage', sendMessageSchema);
const SendEmail = mongoose.model('SendEmail', sendEmailSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aimedoverseasonline@gmail.com',
        pass: 'dulu ndno zsce zuzl'
    }
});
const transporter2 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'apply2aimedoverseas@gmail.com',
        pass: 'lsbl mebl vrkx uszp'
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Subscribe Route
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
        const newSubscription = new Newsletter({ email });
        await newSubscription.save();

        await transporter.sendMail({
            from: 'aimedoverseasonline@gmail.com',
            to: email,
            subject: 'Subscription Confirmation',
            text: 'Thank you for subscribing to our newsletter!',
        });

        res.json({ message: 'Subscription successful!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to subscribe or send email' });
    }
});

// Send Message Route
app.post('/send-message', async (req, res) => {
    const { name, email, phone, message } = req.body;

    const mailOptions = {
        from: 'aimedoverseasonline@gmail.com',
        to: 'apply2aimedoverseas@gmail.com',
        subject: `Contact Form Submission from ${name}`,
        text: `You have a new message from your website contact form.
Name: ${name}
Email: ${email}
Phone: ${phone}
Message:
${message}`
    };
    const mailOptions1 = {
        from: 'apply2aimedoverseas@gmail.com',
        to: email,
        subject: `Contact Form Submission from ${name}`,
        text: `Thank you for contacting us. We will get back to you shortly.`
    };

    try {
        // Send email first
        await transporter.sendMail(mailOptions);
        await transporter2.sendMail(mailOptions1);

        // Save message to database after sending email
        const newMessage = new SendMessage({ name, email, phone, message });
        await newMessage.save();

        res.status(200).json({ message: 'Message sent successfully! We will get back to you soon.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message or save to database.' });
    }
});

// Send Email Route
app.post('/api/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newEmail = new SendEmail({ name, email, message });
        await newEmail.save();

        const mailOptions = {
            from: 'aimedoverseasonline@gmail.com',
            to: email,
            subject: 'Thanks for your response',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}.\n We will get back to you shortly.`
        };

        await transporter.sendMail(mailOptions);
        res.send('Message sent successfully!');
    } catch (error) {
        res.status(500).send('Failed to send message or save to database.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
