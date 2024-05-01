const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const path = require('path');

app.use('/', express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (message) => {
        io.emit('chat message', message);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});