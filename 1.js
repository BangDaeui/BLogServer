const net = require('net'); //net 모듈을 사용한다
const mysql = require('mysql'); //mysql 모듈을 사용한다

const conn = mysql.createConnection({
    host: 'blog.cy4galrovirg.ap-northeast-2.rds.amazonaws.com',
    user: 'BLog',
    password: 'kit2019!',
    database: 'blog'

}); // db로그인
conn.connect(); //db연결

var server = net.createServer(function (socket) {   //net 모듈을 이용해 서버생성

    socket.on('data', function (data) {


        var AppHash = "insert into AppHash(AppHash_SIP, AppHash_Time, AppHash_LogNum, AppHash_Start, AppHash_End, AppHash_Hash) values (?,now(),?,?,?,?)"; //AppHash 테이블 sql 구문
        var ApplicationLog = "insert into ApplicationLog(App_SIP, App_RecordNum, App_Origin, App_TimeGenerated, App_EventID, App_EventType, App_Category, App_Message, App_Hash) values (?,?,?,?,?,?,?,?,?)"; //ApplicationLog 테이블 sql 구문

        var detach = data.toString().split('ㆅ'); // 많은 로그를 받을 때 로그마다 맨 뒤에 있는 구분자를 스플릿해서 구분한다
        console.log(detach);
        for (i = 0; i < detach.length - 1; i++) {

            var divide = detach[i].toString().split('∴'); //AppHash , ApplicaionLog 중 어떤 테이블에 들어갈 로그인지 확인하기 위해 클라이언트에게 받을 때 구분자 앞에 숫자를 넣어 어디테이블에 들어갈지 알려주는데 우선 구분자를 지운다
            var verification = a[0]; //위에서 구분자를 지우면 맨 앞 배열에 1또는 2로 어느 테이블 로그인지 알려주는데 첫번 째 배열 숫자를 verification 변수에 저장한다
            divide.shift(); //첫번째 배열 값을 verification 변수에 저장했으므로 지운다 

            if (verification == 1) {

                conn.query(AppHash, divide, function (err, tmp, fields) {}); //verification 값이 1이면 데이터베이스에 쿼리문을 보내 AppHash 테이블에 저장한다

            } else if (verification == 2) {
                conn.query(ApplicationLog, divide, function (err, tmp, fields) {}); //verification 값이 2 이면 데이터에비스에 쿼리문을 보내 ApplicationLog 테이블에 저장한다.
            }

        }


    });

    socket.on('close', function () {
        console.log('Client disconnted'); //db 전송 끝났을 때 

    });

    server.on('error', function (err) {
        console.log('err' + err); //서버 에러 생겼을 때
    });

}); 


server.listen(9000, function () {
    console.log('listening on 9000');

}); //서버 계속 구동되게 함
