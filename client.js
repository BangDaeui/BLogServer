const net = require('net');

var server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        console.log(data.toString());
    });

    socket.on('close', function () {

    });

    socket.on('error', function (err) {

    });
})

server.listen(9000, function () {
            console.log('9000');
        }
