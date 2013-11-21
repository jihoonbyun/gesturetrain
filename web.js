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
//server.listen(app.get('port'));

// 8080 포트 사용
server.listen(8002);

// 스태틱 파일 설정
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/models', express.static(__dirname + '/models'));


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
app.get('/mobilepage', function (req, res) {
	res.sendfile(__dirname + '/mobile.html');
});

// 소켓아이오 페이지 설정 ( 이렇게 할 필요는 없다. 그냥해봄)
app.get('/socket', function (req, res) {
	res.sendfile(__dirname + 'lib/socket.io.min.js');
});

// util
// 현재시간 구하기 
function getTime(){

	var now = new Date(),
	    year = now.getFullYear(),
	    month =(now.getMonth()+1),
 	    date  = now.getDate(), 
	    hours = now.getHours(),
	    minute = now.getMinutes(),
	    second = now.getSeconds(),
	    day = now.getDay();
	
	var result = {}
	result = {'year' : year, 'month' : month, 'date' : date, 'hours' : hours,
		        'minute' : minute, 'second' : second, 'day' : day }

	return result
}



// 서버 소켓 대기
io.sockets.on('connection', function(socket){

	var time = getTime();
	var address = socket.handshake.address;
	var ip = address.address;
	var port = address.port;
	var sessionid = socket.socket.sessionid;

	socket.on('client', function(user_agent){

		var isMobile = user_agent.isMobile
		var browser = user_agent.browser
		var version = user_agent.version
		var OS = user_agent.OS 
	});
});


