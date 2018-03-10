const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 5000;

let app = express();

let clients = [];
let clientName = {};
let rounds = [];
let currentRound;
let maxRounds;

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'null');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

let server = http.createServer(app);
const io = socketIO(server);

function connectClient(client) {
    console.log('Client ' + client + ' connected');
    clients.push(client);
    console.log(clients);
}

function removeClient(client) {
    console.log('Client ' + client + ' disconnected');
    clients = clients.filter(e => e !== client);
    console.log(clients);

    delete clientName[client];

    if (clients.length == 0) {
        rounds = [];
    }
}

io.sockets.on('connection', (socket) => {
    let client = socket.id;
    connectClient(client);

    socket.on('disconnect', () => {
        removeClient(client);
        io.sockets.emit('getNames', clientName);
    });

    socket.on('setName', (name) => {
        clientName[client] = name;
        io.sockets.emit('getNames', clientName);
    });

    socket.on('startGame', () => {
        maxRounds = clients.length - 1;
        currentRound = 0;
        rounds.push({});
        io.sockets.emit('startGame');
    });

    socket.on('uploadText', (text) => {
        rounds[currentRound][client] = text;

        // check if all players have uploaded text for this round
        let allPlayersReady = true;
        clients.forEach(function(e) {
            if (!rounds[currentRound][e]) {
                allPlayersReady = false;
            }
        });

        if (allPlayersReady) {
            // game over
            if (currentRound > maxRounds) {
                io.sockets.emit('endGame');
            }

            // rotate text around ring and advance round
            clients.forEach(function (e) {
                let nextClientIndex = clients.findIndex((e1) => e1 === e) + 1;
                if (nextClientIndex === clients.length) {
                    nextClientIndex = 0;
                }
                io.sockets.to(clients[nextClientIndex]).emit('downloadText', rounds[currentRound][e]);
            });

            currentRound++;
            rounds.push({});
        }
    });

    socket.on('uploadPicture', (picture) => {
        rounds[currentRound][client] = picture;

        // check if all players have uploaded picture
        let allPlayersReady = true;
        clients.forEach(function(e) {
            if (!rounds[currentRound][e]) {
                allPlayersReady = false;
            }
        });

        if (allPlayersReady) {
            // game over
            if (currentRound > maxRounds) {
                io.sockets.emit('endGame');
            }

            // rotate picture around ring and advance round
            clients.forEach(function (e) {
                let nextClientIndex = clients.findIndex((e1) => e1 === e) + 1;
                if (nextClientIndex === clients.length) {
                    nextClientIndex = 0;
                }
                io.sockets.to(clients[nextClientIndex]).emit('downloadPicture', rounds[currentRound][e]);
            });

            currentRound++;
            rounds.push({});
        }
    });
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
