const express = require('express');
const http = require('http');
const SocketServer = require('ws').Server;
const path = require('path');
const PORT = process.env.PORT || 5000;

let bodyParser = require('body-parser');

let app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function(req, res) {
    console.log(req);
    res.send("Successful post");
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ host: "damp-citadel-60536.herokuapp.com", port: 6969 });

app.on('upgrade', wss.handleUpgrade);

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
    wss.clients.forEach((client) => {
        client.send(new Date().toTimeString());
    });
}, 1000);
