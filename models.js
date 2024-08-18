const mongoose = require('mongoose');
require('dotenv').config();
// Correct the connection string, ensuring the password is URL-encoded
const url = process.env.MONGO_URL;

// Connect to MongoDB without deprecated options
mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Connection error', err);
});

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now }
});

// Send Message Schema
const sendMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
});

// Send Email Schema
const sendEmailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
});

// Models
const Newsletter = mongoose.model('Newsletter', newsletterSchema);
const SendMessage = mongoose.model('SendMessage', sendMessageSchema);
const SendEmail = mongoose.model('SendEmail', sendEmailSchema);

module.exports = {
    Newsletter,
    SendMessage,
    SendEmail
};