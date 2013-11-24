// 서버사이드
// 2013.11.15
// jihoon Byun

// 서버셋팅
var express = require('express'),
		app = express(),
		fs = require('fs'),
		mysql = require('mysql'),
		server = require('http').createServer(app), 
		io = require('socket.io').listen(server);

app.set('port', 8002);

// 8002 포트 사용
server.listen(8002);

// 스태틱 파일 설정
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/models', express.static(__dirname + '/models'));
app.use('/server', express.static(__dirname + '/server'));
app.use('/client', express.static(__dirname + '/client'));
/*
var mysqlConfig = {
	host : 'localhost',
	port : '8002',
	user : 'root',
	password : ''
	//database : ,
	}

var sql = "select * from 'INFORMATION_SCHEMA'.'PROCESSLIST'"

var connect = mysql.createConnection(mysqlConfig)

  connect.connect(function(err,rows){
		console.log('DB-Success');
		console.log(rows);
	});	
*/	



// 메인(VIEW) 페이지 설정
app.get('/index', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

app.get('/signin', function(req,res){
	res.sendfile(__dirname + '/signin.html');
});
app.get('/dashboard', function(req,res){
	res.sendfile(__dirname + '/dashboard.html');
});


// 모바일 테스트  페이지 설정
app.get('/mobile', function (req, res) {
	res.sendfile(__dirname + '/mobile.html');
});

// 소켓아이오 페이지 설정 ( 이렇게 할 필요는 없다. 그냥해봄)
app.get('/socket', function (req, res) {
	res.sendfile(__dirname + 'lib/socket.io.min.js');
});

// 설정파일 로드
var cfg = require('./config') 
var geo = require('./server/geo');

// 서버 소켓 대기
io.sockets.on('connection', function(socket){

	console.log('Client has been Connected');

	socket.emit('config', cfg);

	socket.on('userdata', function(x){
		var x = x;
    var reg = userCheck(x);
		socket.emit('confirm', reg);

		  socket.on('touches', function(bigdata){
				// 2단계 : 터치데이터를 전송받는다
				console.log(bigdata);

		  });


	});
});

function userCheck(usd){
	
	var k = guid();

return { 
	type : 'permitted', 
	newkey : k
}
}



function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}



