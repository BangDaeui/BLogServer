// base64 처리하지 않은 로그 데이터 전송하는 js 파일
const net = require('net');
const mysql = require('mysql');
const os = require('os');

var socket = net.connect({port: 9000,host: 'localhost'});

socket.on('connect', function () {
    console.log('connected to server');

    socket.write('1@192.168.0.45@ApplicationLog20191029@4f465bb8b6b451d41939f164aa4186ad*');

    socket.write('1@192.168.0.45@ApplicationLog20191026@4f465bb8b6b451d41939f164aa4186ad*');

    socket.write('1@192.168.0.45@ApplicationLog20191027@4f465bb8b6b451d41939f164aa4186ad*');

    socket.write('1@192.168.0.45@ApplicationLog20191028@4f465bb8b6b451d41939f164aa4186ad*');

    this.end();
})


socket.on('close', function () {
    console.log('Connection closed');
});

socket.on('error', function (err) {
    console.log(err);
});

console.log(os.networkInterfaces()['Wi-Fi'][1].address);
