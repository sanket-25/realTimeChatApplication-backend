const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(bodyParser.json());
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Hello World Route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Protected Route
app.get('/api/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});

module.exports = app;
