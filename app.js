// express 웹서버 모듈
const express = require('express');
const app = express();

// path 경로 관련 모듈
const path = require('path');

// net
const net = require('net');

// handlebars 서버 사이드 템플릿 엔진
const exphbs = require('express-handlebars');

// mysql SQL
const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'blog.cy4galrovirg.ap-northeast-2.rds.amazonaws.com',
    user: 'BLog',
    password: 'kit2019!',
    database: 'blog'

});
conn.connect();

// View engine setup
app.engine('handlebars', exphbs({
    defaultLayout: false
}));
app.set('view engine', 'handlebars');

// Static folder 폴더 사용
app.use('/public', express.static(path.join(__dirname, 'public')));

// #################################################################### Hyperledger Fabric SDK



// #################################################################### Web Application

// [Get] Users
// 데이터베이스에 있는 사용자 데이터 웹에 보여주기
app.get('/Refresh', async (req, res) => {
    res.redirect('/Logs');
})

// [Get] Users
// 데이터베이스에 있는 사용자 데이터 웹에 보여주기
app.get('/Users', async (req, res) => {
    var sql1 = 'select * from User';

    conn.query(sql1, function (err, result, fields) {
        res.render('Users', {
            result: result
        });
    });
})

// [Get] UserLogs http://localhost:3000/UserLogs
// 데이터베이스에 있는 사용자 별 데이터 웹에 보여주기
app.get('/UserLogs/:id', async (req, res) => {
    var id = req.params.id;
    console.log(id);
    var sql1 = 'select * from User where User_No = ?';
    var sql2 = 'select * from ApplicationLog where App_User =?';
    // View폴더 안에있는 UserLogs.handlebars 파일 보이게 해줌
    conn.query(sql1, [id], function (err, result1, fields) {
        conn.query(sql2, [id], function (err, result2, fields) {
            res.render('UserLogs', {
                result1: result1,
                result2: result2
            });
        });
    });

})

// [Get] Logs
// 데이터베이스에 있는 로그 데이터 웹에 보여주기
app.get('/Logs', async (req, res) => {
    var sql1 = 'select * from User, ApplicationLog where User_No = App_User;';
    conn.query(sql1, function (err, result, fields) {
        res.render('Logs', {
            result: result

        });
    });

})

// [Get] table
// localhost:3000/table
app.get('/table', (req, res) => {
    var sql1 = 'select * from ExampleTable';
    conn.query(sql1, function (err, result, fields) {
        res.render('table', {
            result: result
        });
    });
})

// [Get] Dashboard
app.get('/', async (req, res) => {
    res.render('Users', {});
})

app.listen(3000, () => console.log('Server Start'));

// #################################################################### Socket

var server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        console.log(data);
    });

    socket.on('close', function () {
        console.log('Client disconnted');
    });

    server.on('error', function (err) {
        console.log('err' + err);
    });
});


server.listen(9000, function () {
    console.log('listening on 9000');
});
