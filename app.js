// express
const express = require('express');
const app = express();

// path
const path = require('path');

// handlebars
const exphbs = require('express-handlebars');

// mysql
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

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// [Get] Users
app.get('/Users.html', async (req, res) => {
    res.render('Users', {});
})

// [Get] UserLogs
app.get('/UserLogs.html', async (req, res) => {
    res.render('UserLogs', {});
})

// [Get] Logs
app.get('/Logs.html', async (req, res) => {
    res.render('Logs', {});
})

// [Get] tables
app.get('/tables', (req, res) => {
    var sql1 = 'select * from ExampleTable';
    conn.query(sql1, function (err, result, fields) {
        res.render('tables', {
            result:result
        });
    }); 
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
    res.render('dashboard', {});
})
 
app.listen(3000, () => console.log('Server Start'));