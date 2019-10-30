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
app.get('/Users', async (req, res) => {
    res.render('Users', {});
})

// [Get] UserLogs http://localhost:3000/UserLogs
// 데이터베이스에 있는 사용자 별 데이터 웹에 보여주기
app.get('/UserLogs', async (req, res) => {

    // View폴더 안에있는 UserLogs.handlebars 파일 보이게 해줌
    res.render('UserLogs', {});

})

// [Get] Logs
// 데이터베이스에 있는 로그 데이터 웹에 보여주기
app.get('/Logs', async (req, res) => {
    res.render('Logs', {});
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

var server = net.createServer(function (socket) { //net 모듈을 이용해 서버생성

    socket.on('data', function (data) {

        var detach = data.toString().split('*'); // 많은 로그를 받을 때 로그마다 맨 뒤에 있는 구분자를 스플릿해서 구분한다
        console.log(detach);

        for (i = 0; i < detach.length - 1; i++) {

            list(detach[i]);

        };

        socket.on('close', function () {
            console.log('Client disconnted'); //db 전송 끝났을 때 

        });

        server.on('error', function (err) {
            console.log('err' + err); //서버 에러 생겼을 때
        });


    })



}); //서버 계속 구동되게 함

function list(p1) {

    var ApplicationLog = "insert into ApplicationLog(App_User,App_Name,App_Time, App_Hash) values (?,?,now(),?)"; //ApplicationLog 테이블 sql 구문
    var ExampleTable = "update ApplicationLog set App_Hash = '?' where App_Name = '?' "; //update 할 날짜와 Hash값
    var sql1 = 'select User_No from User where User_IP = ?';

    var divide = p1.toString().split('@'); //AppHash , ApplicaionLog 중 어떤 테이블에 들어갈 로그인지 확인하기 위해 클라이언트에게 받을 때 구분자 앞에 숫자를 넣어 어디테이블에 들어갈지 알려주는데 우선 구분자를 지운다
    var verification = divide[0]; //위에서 구분자를 지우면 맨 앞 배열에 1또는 2로 어느 테이블 로그인지 알려주는데 첫번 째 배열 숫자를 verification 변수에 저장한다
    divide.shift(); //첫번째 배열 값을 verification 변수에 저장했으므로 지운다 
    console.log(divide);
    if (verification == 1) {

        conn.query(sql1, divide[0], function (err, tmp, fields) {

            conn.query(ApplicationLog, [tmp[0].User_No, divide[1], divide[2]], function (err, tmp, fields) {
                console.log(err);
            }); //verification 값이 1이면 데이터베이스에 쿼리문을 보내 AppHash 테이블에 저장한다     

        });

    } else if (verification == 2) {


        conn.query(ExampleTable, [divide[2], divide[1]], function (err, tmp, fields) {


        }); //verification 값이 2 이면 가장 최근에 받은 값을 제외하고 나머지의 hash 값을 전부 update 한다.

    }

}


server.listen(9000, function () {
    console.log('listening on 9000');
});
