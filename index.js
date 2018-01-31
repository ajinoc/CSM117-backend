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

io.on('connection', (socket) => {
  let id = socket.id;
  console.log('Client' + id + ' connected');
  clients.append(socket.id)
  console.log(clients);

  socket.on('disconnect', () => {
    console.log('Client ' + id + ' disconnected');

    // remove id from list
    clients = clients.filter(e => e !== id);

    console.log(clients);
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
