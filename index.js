const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
app.use('/', express.static(path.join(__dirname, '/UI')));
const io = require('socket.io')(server);
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 9600
});

const parser = new Readline();
let dataFromArduino;

port.pipe(parser);
parser.on('data', (data) => {
    dataFromArduino = data;
});

// socketIO
io.on('connection', function(client) {
    client.on('disconnect', function() {
        console.log("disconnected")
    });
    client.on('room', function(data) {
        client.join(data.roomId);
        console.log(' Client joined the room and client id is '+ client.id);

    });
    client.on('toBackEnd', function(data) {
        client.in(data.roomId).emit('message', data);
    });
    setInterval(function () {
        client.emit("fromNode", dataFromArduino);
    }, 6000);
});

server.listen(3000);


