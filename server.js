const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Load existing messages from file
let messages = [];
fs.readFile('messages.json', 'utf8', (err, data) => {
    if (!err) {
        messages = JSON.parse(data);
    }
});

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected');

    // Emit existing messages when a user connects
    socket.emit('init', messages);

    // Handle new messages
    socket.on('message', (data) => {
        messages.push(data);
        io.emit('message', data); // Broadcast message to all clients
        // Save messages to file
        fs.writeFile('messages.json', JSON.stringify(messages), (err) => {
            if (err) {
                console.error('Error saving messages to file:', err);
            }
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
