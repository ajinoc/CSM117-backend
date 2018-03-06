const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 5000;

let app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'null');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

let server = http.createServer(app);
const io = socketIO(server);

let clients = [];
let clientText = {};
let clientPicture = {};

function connectClient(client) {
    console.log('Client ' + client + ' connected');
    clients.push(client);
    console.log(clients);
}

function removeClient(client) {
    console.log('Client ' + client + ' disconnected');
    clients = clients.filter(e => e !== client);
    delete clientText[client];
    delete clientPicture[client];
    console.log(clients);
}

function uploadText(text, client) {
    console.log('Uploading text \'' + text + '\' from client ' + client);
    clientText[client] = text;
    console.log(clientText);
}

function uploadPicture(picture, client) {
    console.log('Uploading picture \'' + picture + '\' from client ' + client);
    clientPicture[client] = picture;
    console.log(clientPicture);
}

io.sockets.on('connection', (socket) => {
    let client = socket.id;
    connectClient(client);

    socket.on('disconnect', () => {
        removeClient(client);
    });

    socket.on('uploadText', (text) => {
        uploadText(text, client);

        let nextClientIndex = clients.findIndex((e) => client === e) + 1;
        if (nextClientIndex === clients.length) {
            nextClientIndex = 0;
        }

        io.sockets.to(clients[nextClientIndex]).emit('downloadText', text);
    });

    socket.on('uploadPicture', (picture) => {
        uploadPicture(picture, client);

        let nextClientIndex = clients.findIndex((e) => client === e) + 1;
        if (nextClientIndex === clients.length) {
            nextClientIndex = 0;
        }

        io.sockets.to(clients[nextClientIndex]).emit('downloadPicture', picture);
    });
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
