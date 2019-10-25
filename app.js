// express 웹서버 모듈
const express = require('express');
const app = express();

// path 경로 관련 모듈
const path = require('path');

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

// ####################################################################

// [Get] Users
app.get('/Users.html', async (req, res) => {
    res.render('Users', {});
})

// [Get] UserLogs http://localhost:3000/UserLogs.html
app.get('/UserLogs.html', async (req, res) => {
    
    // View폴더 안에있는 UserLogs.handlebars 파일 보이게 해줌
    res.render('UserLogs', {});
    
})

// [Get] Logs
app.get('/Logs.html', async (req, res) => {
    res.render('Logs', {});
})

// [Get] table
// localhost:3000/table
app.get('/table', (req, res) => {
    var sql1 = 'select * from ExampleTable';
    conn.query(sql1, function (err, result, fields) {
        res.render('table', {
            result:result
        });
    }); 
})

// [Get] Dashboard
app.get('/', async (req, res) => {
    res.render('Users', {});
})
 
app.listen(3000, () => console.log('Server Start'));