const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { v4: uuidv4 } = require("uuid");

const path = require('path');
app.use('/', express.static(path.join(__dirname, 'public')));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/choseong', (req, res) => {
    const roomId = uuidv4();
    const nickname = req.body.nickname;
    res.redirect(301, `/choseong.html?roomId=${roomId}&nickname=${nickname}`);
})

io.on('connection', (socket) => {
    console.log('a user connected')

    const url = new URL(socket.handshake.headers.referer);
    const params = url.searchParams;
    const roomId = params.get('roomId');
    const nickname = params.get('nickname');
    socket.join(roomId);

    socket.on('chat message', (message) => {
        io.to(roomId).emit('chat message', `[${nickname}]: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});