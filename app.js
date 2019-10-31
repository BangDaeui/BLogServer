// express 웹서버 모듈
const express = require('express');
const app = express();

// path 경로 관련 모듈
const fs = require('fs');
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

// fabric-network
const { FileSystemWallet, Gateway } = require('fabric-network');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// main
var walletPath = null;
var wallet = null;
var userExists = null;
var gateway = null;
var network = null;
var contract = null;
var result = null;

// #################################################################### Hyperledger Fabric SDK

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        walletPath = path.join(process.cwd(), 'wallet');
        wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        contract = network.getContract('fabcar');
        result = await contract.evaluateTransaction('queryUserHash', '0');
        console.log(JSON.parse(result));
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();

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
