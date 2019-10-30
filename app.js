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

        var detach = data.toString().split('*'); // 많은 로그를 받을 때 * 구문자를 기준으로 나누어 차례대로 detach 배열에 넣는다.
        console.log(detach);

        for (i = 0; i < detach.length - 1; i++) {// 2개 로그를 보냈을 시 detach 배열은 [첫번째 로그 정보],[두번째 로그 정보],[] 같이 마지막에 빈 배열이 남는다, 로그정보만 for문을 돌리면 되어 detach.length -1을 한다.

            list(detach[i]);

        };

        socket.on('close', function () {
            console.log('Client disconnted'); //db 전송 끝남 알림.

        });

        server.on('error', function (err) {
            console.log('err' + err); //서버 에러 알림.
        });


    })



}); //서버 계속 구동되게 함

function list(p1) {

    var ApplicationLog = "insert into ApplicationLog(App_User,App_Name,App_Time, App_Hash) values (?,?,now(),?)"; //ApplicationLog 테이블에 클라이언트에서 받는 로그 정보 전달 구문
    var update_AppLog = "update ApplicationLog set App_Hash = '?' where App_Name = '?' "; //Application 테이블에 로그 값 업데이트 구문
    var sql1 = 'select User_No from User where User_IP = ?'; // User 테이블에서 클라이언트에서 받은 IP의 User_NO 값 찾는 구문 

    var divide = p1.toString().split('@'); // detach에서 @문자를 기준으로 배열로 나눈다
    var verification = divide[0]; // divide의 값은 [1or2],[ip주소],[파일명],[해쉬값] 인데 첫번째 배열의 값인 1or2는 insert/update 를 확인하기 위한 구문자이므로 지우기 전 verication 변수에 저장한다
    divide.shift(); //첫번째 배열 값을 verification 변수에 저장했으므로 지운다 
    console.log(divide);
    if (verification == 1) {

        conn.query(sql1, divide[0], function (err, tmp, fields) {//sql1 구문에서 찾은 User_No 값은 tmp배열에 저장된다.
            
            conn.query(ApplicationLog, [tmp[0].User_No, divide[1], divide[2]], function (err, tmp, fields) {
                console.log(err);
            
            }); //verification 값이 1이면 User테이블에서 ip에 맞는 User_No 값을 찾아 User_NO,파일명,해쉬값 순으로 DB에 넣는다.     

        });

    } else if (verification == 2) {


        conn.query(update_AppLog, [divide[2], divide[1]], function (err, tmp, fields) {


        }); //verification 값이 2 이면 클라이언트에서 받은 로그를 파일명 기준으로 해쉬값을 업데이트한다.

    }

}


server.listen(9000, function () {
    console.log('listening on 9000'); // 항상 9000번 포트로 서버를 구동하게 한다.
});
