const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 5000;

let app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "null");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

let server = http.createServer(app);

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

let clients = [];

function removeClient(client) {
    console.log('Client ' + client + ' disconnected');

    // remove client from list
    clients = clients.filter(e => e !== client);

    console.log(clients);
}

io.on('connection', (socket) => {
    let client = socket.id;
    console.log('Client ' + client + ' connected');
    clients.push(client);
    console.log(clients);

    socket.on('disconnect', () => {
        removeClient(client);
    });

    setInterval(() => {
        clients.forEach((client) => {
            socket.to(client).emit('testAlive', (res) => {
                if (!res) {
                    removeClient(client);
                }
            });
        });
    }, 500);
});


