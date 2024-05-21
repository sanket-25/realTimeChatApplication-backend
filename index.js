const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const connectDB = require('./config/db');
const app = require('./app');
const Message = require('./models/messageModel');

// Initialize Express
const server = http.createServer(app);

// Initialize WebSocket server instance
const wss = new WebSocket.Server({ server });

// Connect Database
connectDB();

// Handle WebSocket connections
wss.on('connection', ws => {
    console.log('New client connected');

    // Send all previous messages to the newly connected client
    Message.find().then(messages => {
        ws.send(JSON.stringify({ type: 'history', data: messages }));
    });

    ws.on('message', async message => {
        const parsedMessage = JSON.parse(message);
        const { userId, text } = parsedMessage;

        // Save message to the database
        const newMessage = new Message({ userId, text });
        await newMessage.save();

        // Broadcast the message to all connected clients
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ userId, text }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   