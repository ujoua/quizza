const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const { v1: uuidv4 } = require('uuid');
const { serialize, parse } = require('cookie');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({ // express-session
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

const rooms = {
};

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/lobby', (req, res) => {
    const nickname = req.body.nickname;
    res.cookie('nickname', nickname);

    if (!req.query.roomId) {
        res.cookie('captain', 1);
        const roomId = uuidv4();
        res.redirect(`/lobby?roomId=${roomId}`);
    }
    res.cookie('captain', 1);
    res.redirect(`/lobby?roomId=${req.query.roomId}`);
});

app.get('/lobby', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lobby.html'));
});

app.get('/choseong', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'choseong.html'));
})

io.of('/lobby').on('connection', (socket) => {
    console.log('a user connected');

    const url = new URL(socket.handshake.headers.referer);
    const params = url.searchParams;
    const roomId = params.get('roomId');

    socket.join(roomId);

    const cookies = parse(socket.handshake.headers.cookie);
    const nickname = cookies.nickname;

    if (!rooms[roomId]) {
        rooms[roomId] = {};
    };
    const room = rooms[roomId];
    room[socket.id] = nickname;

    socket.nsp.to(roomId).emit('players', rooms[roomId]); // https://github.com/socketio/socket.io/issues/3449

    socket.on('start', () => {
        socket.nsp.to(roomId).emit('start');
    })

    // socket.on('chat message', (message) => {
    //     io.to(roomId).emit('chat message', `[${nickname}]: ${message}`);
    // });

    // socket.on('answer message', (message) => {
    //     io.to(roomId).emit('chat message', `[${nickname}]: ${message}`);
    //     io.to(roomId).emit('chat message', `[${nickname}]님이 정답을 맞혔습니다.`);
    //     io.to(roomId).emit('system message', Math.floor(Math.random() * 10));
    // });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete room[socket.id];
        socket.to(roomId).emit('players', rooms[roomId]);
    });
});


server.listen(3000, () => { // 이거 server를 app으로 바꿨다간 GET http://localhost:3000/socket.io/socket.io.js net::ERR_ABORTED 404 (Not Found) 오류 발생함.
    console.log('listening on *:3000');
});