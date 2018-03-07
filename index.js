const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 5000;

let app = express();

let clients = [];
let clientName = {};
let clientText = {};
let clientPicture = {};

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'null');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.get('/names', function(req, res, next) {
    res.json(clientName);
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
    delete clientName[client];
    delete clientText[client];
    delete clientPicture[client];
    console.log(clients);
}

io.sockets.on('connection', (socket) => {
    let client = socket.id;
    connectClient(client);

    socket.on('disconnect', () => {
        removeClient(client);
    });

    socket.on('setName', (name) => {
        clientName[client] = name;
        console.log(clientName);
    });

    socket.on('uploadText', (text) => {
        clientText[client] = text;

        let allPlayersReady = false;



        let nextClientIndex = clients.findIndex((e) => client === e) + 1;
        if (nextClientIndex === clients.length) {
            nextClientIndex = 0;
        }

        io.sockets.to(clients[nextClientIndex]).emit('downloadText', text);
    });

    socket.on('uploadPicture', (picture) => {
        clientPicture[client] = picture;

        let nextClientIndex = clients.findIndex((e) => client === e) + 1;
        if (nextClientIndex === clients.length) {
            nextClientIndex = 0;
        }

        io.sockets.to(clients[nextClientIndex]).emit('downloadPicture', picture);
    });
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
