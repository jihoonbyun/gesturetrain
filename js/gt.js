// GestureTrain v1.0.0 (client-side tracker)
// 2013.11.23 written by jhb (beagledog@naver.com)

/* 터치 이벤트 리스너 등록 (작동이 제대로 되지 않음)
  window.addEventListener('touchstart', $.rd, false);
  window.addEventListener('touchend', $.rd, false); 
  window.addEventListener('touchmove', $.rd, false);
  */

/*
 * 서버컨넥션
 * socket.io
 */
var serverUrl = 'http://beagledog11111.cafe24.com:8002';
var socket = io.connect(serverUrl);
socket.on('config', function(config){ 

var config = config
var ud= new $.ud(config);
var userdata = ud.init 
var sessionid =io.sockets[serverUrl].sessionid
	//console.log(JSON.stringify(localStorage).length)
	// 터치 이벤트 리스너
jQuery(window).on('touchstart',filter);
jQuery(window).on('touchend',filter);
jQuery(window).on('touchmove',filter);

// 이벤트 필터링
// 이유는 모르겠으나 필터링을 해줘야함	
function filter(e){
	if(e.type == 'touchstart'){ $.rd.tos(e); }
	if(e.type == 'touchend'){ $.rd.toe(e, config, userdata); }
	if(e.type == 'touchmove') { $.rd.tom(e); }
}

	socket.emit('userdata', userdata);

// 인증을받았을때, 터치데이터 전송을 시작한다
socket.on('confirm', function(register){

	// 허용되었을때
	if(register.type == 'permitted') {
		var newkey = register.newkey;
		var exist = ud.isExist();

		// 키가 존재하지 않을떄. 키를 저장한다
		if(exist == false){
			ud.saveKey(newkey,config);
		}

		// 키가 존재할떄(실제키는 바뀌지않는다. 그러나 스토리지가 바뀌었는지 체크하고 바뀌면 이동된다)
		if(exist == true){
			ud.changeKey(newkey,config)
		}

		socket.emit('s', 'The first socket message!');
		socket.on('c', function(oneorzero){

			// 기억하자! 동기적 코딩이니까, 위의 config 변수를 받을 수 있다!
			 var opt = config.traffic_OPTION
			 var time = config.traffic_TIME
			// 정상 전송모드
			if(oneorzero == 1){

				// 키값과 데이터받아서 해당 데이터 보내고 삭제
				// 쿠키일경우 바로 보내야하기 떄문에, 바로보낸다
				function sendGtaa(localid,gtaa){ 
					socket.emit('s', gtaa );
					 if(window.localStorage){
					  localStorage.removeItem(localid);
				   }	
					}

				// 모두보내고 로컬 삭제
				function sendAll(){
						var rekey = $.rd.getRecordkey();
						var releng = rekey.length;
						if(releng >=1){
						 for(var i=0; i <releng; i++){
						   var current = localStorage.getItem(rekey[i]);
							 socket.emit('s', current);
							 localStorage.removeItem(rekey[i]);	
					   }
						}
					}

				
				if(opt == 'time'){			
		     // 현재 로컬에 등록된 아이디박스가 1개 이상일때, setInterval 구동
		      setInterval( function(){sendAll()},time);
				}
			}

			// 비상 전송 모드
			if(oneorzero == 0){
				// changing options
			}
		});	
	}
}) // confirmed
}) // config

 var $ = {

  rd : {

  Recordbox : {},

  Gesturebox : [],

  Count : 0, // start -end 세트 쿼리
  
  totalCount : 0, //모든 쿼리
  
  movings : {},
  
  idbox : function(){
	 this.id= '';
	 this.elapsed = '';
	 this.stat = 'single';
	 this.start = [];
	 this.move = []; 
	 this.end = [];
	 this.direction = [];
  },

  gbox : function(){
	 this.gesture = '';
	 this.id ='';
	 this.starttime = 0;
	 this.endtime =0;
	 this.startpoint =[];
	 this.endpoint =[];
	 this.direction =[];
	 this.movingset =[] // 무브 데이터를 x,y로 나눠 압축해서 저장
  },

  // 피타고라스 
  distance_two  : function(pt, pt2) {

	var x2 = Math.pow((pt[0]-pt2[0]),2),
	    y2 = Math.pow((pt[1]-pt2[1]),2);

	return Math.sqrt((x2+y2));
  },

  // 각도 구하기
  getAngle : function(P1, P2){

  var deltaY = P2.y - P1.y,
      deltaX = P2.x - P1.x,
      degree = Math.atan2(deltaY / deltaX) * 180 / Math.PI
	return degree;
  },

  // lzw 인코딩 디코딩(https://gist.github.com/revolunet/843889)
  lzw_encode : function(s) {
		//var s =JSON.stringify(s);
    var dict = {}, data = (s + "").split(""), out = [],
        currChar, phrase = data[0], code = 256;

    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
  },
 
  // Decompress an LZW-encoded string
  lzw_decode : function(s) {
   var dict = {}, data = (s + "").split(""), currChar = data[0],
    oldPhrase = currChar, out = [currChar],code = 256, phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("")
  },


// 방향각도 구하기
getDirection : function(id){
    
		var g = $.rd.Recordbox[id],
		    stat = g['stat'],
		    gm = g.move,
		    l = gm.length,
		    sc = g.start.pageX - g.end.pageX,
		    e = g.start.pageY - g.end.pageX,
		    direction = []

		// direction 결정
		if(sc <0) { g['direction'][0] = 'right'}
		if(sc =0) { g['direction'][0] = 'same'}
		if(sc >0) { g['direction'][0] ='left'}

		if(ec <0) { g['direction'][0] = 'up' }
		if(ec =0) { g['direction'][0] ='same' }
		if(ec >0) { g['direction'][0] ='down' }	

},

// 핀치인지 스프레드인지
isPinch : function(id){
	var set =  $.rd.movings[id],
			leng = set.length;

	// 핀치 or 스프레드 일때
	// 손가락이 두개 올려져있을때만 판단한다
	if(set){
		if (leng = 2){

			var a = set[0],
					b = set[1],
					first_distance = $.rd.distance_two(a.start, b.start),
					last_distance = $.rd.distance_two(a.end, b.end)

						first_distance > last_distance ? true : false
		}
	}
},

// touchstart 핸들러
 tos : function(e){
		var touches = e.originalEvent.touches,
		    leng = touches.length;

		// 아이디박스를 최초로 생성한다
		var newid = new $.rd.idbox();

		// 받은 터치객체를 리스트화한다
		var touches = $.rd.listify(touches[leng-1]);
		
		// 아이디를 현재 올려져있는 터처 중 가장 나중에 것을 선택한다
		newid.id = touches['identifier'];
		
		// start에 해당 이벤트 객체를 집어 넣는다.
		newid['start'] = touches
		
		// elapsed에 해당 이벤트 객체의 최초 시간을 집어 넣는다.
		newid['elapsed'] = e.timeStamp

    newid['starttime'] = e.timeStamp
    
    // 리코드박스에 해당 객체 아이디명을 키값으로, 아이디박스를 객체로 넣는다		
	  $.rd.Recordbox[newid.id] = newid
	},


// touchmove 핸들러
tom : function(e){
		e.preventDefault()
		var mov = e.originalEvent.touches,
		    moves = [];
	  
	  // 현재 움직이는 터치의 갯수를 반복문 돌린다	
		for(var i=0,mleng = mov.length;i<mleng;i++){

			// 움직이는 터치 아이디 listify
			var move = $.rd.listify(mov[i]);

			// 움직이는 터치의 아이디 추출
			var movid = move['identifier']

			// 리코드 박스에서 움직이는 터치 아이디를 찾아 move에 이벤트 객체 넣기
			$.rd.Recordbox[movid]['move'].push(move);

			// 한번에 움직이는 손가락이 두개 이상일 때
			if(mleng >1){

				// 리코드박스에 움직이는 손가락 아이디 찾아서 스탯에 멀티 추가
				$.rd.Recordbox[movid]['stat'] = 'multi';
				
				// 무브스에 해당 아이디 집어넣기
				moves.push(movid);
			}
		}
		// 무부스를 키값으로하고, 무부스아이디 묶음을 집어넣기
		$.rd.movings[moves[0]] = moves;
	},


// touchend 핸들러	
toe : function(e,c,u){
	var end = e.originalEvent.changedTouches,
	    endlisted = $.rd.listify(end[0])
			endid = endlisted['identifier'],
			result = parseInt(e.timeStamp - $.rd.Recordbox[endid]['elapsed']);
	
	var storage = u.storage;
	var soption = c.traffic_OPTION
	var stage = c.compress_STAGE
	var maxlocalsize = c.traffic_MAX_STORAGE_KB
	var lzw = c.compress_LZW

	// 리코드박스에서 끝난 터치의 아이디 찾아서 end에 이벤트객체 넣기	
	$.rd.Recordbox[endid]['end'] = endlisted;

	// elapsed에 끝난시간에서 현재 현재시간을 뺀다
	$.rd.Recordbox[endid]['elapsed'] = result 
  $.rd.Recordbox[endid]['endtime'] = e.timeStamp

	// 레코드 박스에 들어오자마자 바로 압죽데이터 만든다	
	var data = $.rd.zipIdbox($.rd.Recordbox[endid], stage, lzw) 

	// 로컬에 저장될 아이디를 설정한다
	var localid = 'gtaa' + endid;

	// 로컬스토리지일경우, 로컬스토리지에 저장시키고 바로 삭제시킨다
	if(storage == 'localStorage') { 
		localStorage.setItem(localid, data);
		delete $.rd.Recordbox[endid]  // 삭제
	}

	// 쿠키일경우, 저장이 불가능하므로 바로 보내버리고 삭제시킨다
	if(storage == 'cookie'){
			sendGtaa(localid,data); // 쿠키일경우 바로보낸다.
		delete	$.rd.Recordbox[endid] // 삭제
	}

	// 쿼리일 경우, 설정된 숫자와 현재 로컬에 저장된 아이디박스 갯수를 비교
	if(soption == 'query' || soption == 'auto' ){
		var query = c.traffic_QUERY
		var arrleng = $.rd.getRecordkey().lenth;
			if(arrleng	>= query){  sendAll() }
	}

	// 용량일 경우, 로컬스토리지인지 확인하고 현재용량이 맥시멈보다 높을때
	// 현재 로컬에 저장된 아이디박스를 전부 전송시킨다.
	if(soption == 'kb' ||  soption == 'auto'){
		if(storage == 'localStorage'){
			var currentsize = $.rd.getLocalsize()
				if(currentsize >= maxlocalsize){
						 sendAll();
				 }
		  }
	 }
},

	//gtaa 생성법 : gtaa + 숫자
	getRecordkey : function(){
var temp = $.rd.getLocalkeys();
var current = [];
var patt =/^gtaa+(\d+)$/;
for(var i=0, j= temp.length;i<j; i++){
	if(patt.test(temp[i])) { current.push(temp[i]);}
}
return current
},

getLocalkeys : function(){
	var temp =[];
	for(var key in window.localStorage){
		temp.push(key)
	}
	return temp
},


getGesture : function(id){
    var id = id;
		var moment = $.rd.Recordbox[id],
		    stat = moment['stat'],
		    leng = $.rd.Recordbox.length,
		    mx = moment['pageX'],
		    my = moment['pageY'];

		
		var id = parseInt(id),
		    before = $.rd.Recordbox[id-1],
		    bx = before['pageX'],
		    by = before['pageY'],
		    chx = parseInt(Math.abs(mx-bx)),
		    chy = parseInt(Math.abs(by-my));


		// 리코드 박스에 아이디박스가 존재할때
		if(leng >0){

			// 해당 아이디박스의 스탯이 멀티일때
			// 즉 스크린에 두손이상이 올려져 있었을때.

			if( stat == 'multi'){

				// 핀치이면 핀치함수 발생
				// 스프레드면 스프레드함수 발생
         var is = $.rd.isPinch(id) 
				return is ? 'pinch' : 'spread';
				
			} // 멀티 끝


			// 해당 아이디박스의 스탯이 싱글일떄
			// 즉 스크린에 한손만이 올려져 있었을때
			if(stat == 'single'){

				// 무브가 발생했을때 드래그 함수 발생
				var mleng = moment['move'].length;
				mleng > 0 ? 'drag' :

				// 스타트에서 엔드까지 1초 이상 지나면
				// 롱탭함수 발생
				moment['elapsed'] >= 1000 ? 'longtab' : 

				// elapsed 타임이 1초 이전에다가 x,y좌표가 5이하이면 더블탭
				// 아무것도 아니면 탭
				before['elapsed'] < 1000 && chx <6 && chy<6 ? 'doubletab' : 'tab'

			} // 싱글 끝
		}
	}, // 알고리즘 끝



	// screen, page,client
gboxMaker : function(id, windows){

		var rb = $.rd.Recordbox[id],
		p1 = {},
		p2 = {},

		stX = rb.start[windows + 'X'],
		stY = rb.start[windows + 'Y'],
		edX = rb.end[windows + 'X'],
		edY = rb.end[windows + 'Y'],

		xdata =[],
		ydata =[];


		p1 = {x : stX, y : stY}
		p2 = {x : edX, y : edY}

		// gbox 인스턴스 생성
		var gb = new $.rd.gbox();

		// 제스처 정보 알아내기
		gb.gesture = $.rd.getGesuture(id)

		// 스타트 타임 알아내기
		gb.startime = rb.starttime

		// 엔드 타임 알아내기
		gb.endtime = rb.endtime

		// 스타트 포인트
		gb.startpoint = p1

		// 엔드 포인트
		gb.endpoint = p2

		// 무빙데이터 따로 넣기
		for(var i=0, mleng = rb.move.length; i<mleng;i++){
		xdata.push(rb.move[i][0]);
		ydata.push(rb.move[i][1]);
		}

		// 압축하기
		xdata = $.rd.lzw_encode(xdata);
		ydata = $.rd.lzw_encode(ydata);

		// 무빙셋에 넣기
		gb.movingset = [xdata, ydata]

    $.rd.Gesturebox.push(gb);
 },
 
 // zipbox contains
 //
 // 압축생략!!!!!!!!!!!!
 // compress_STAGE = 1
 // identifier, clientX 같은 키값으로 불류 &  압축
 // 총 70개 객체 생성된다.
 // zipbox[0] = stage
 // zipbox[1] = main datas
 // zipbox[2] = [[key][start,move,move,....end], [start,move,end..]]// lzw 압축
 //  ....
 //
 // compress_STAGE = 2
 // 그냥 쑤셔넣고 압축 하는 방법
 // 터치수만큼 객체가 생성된다.
 // 이유는 모르겠지만 성능이 훨씬 탁월하다
 // zipbox[0] = stage
 // zipbox[1] = main datas
 // zipbox[2] = [[key][start][move][end]] //lzw 압축
 //
 //
 //  option = {...compress_LZW : true, compress_STAGE : 2 } 
 //  주.
 //  나중에 꼭 array에 push 하는것 vs 객체 퍼포먼스를 비교해보자
 //  최근 실험에서는 push가 성능이 떨어짐을 본적 이있는데, 사용이 편리하여 일단 사용한다
 //  단순히 함수 성능 뿐만아니라, 로컬에서의 I/O도 고려해야한다.
 zipIdbox : function(idbox, stage, lzw){ 
		var stage = stage	
		var lzw = lzw
		var idbox = idbox,option = option;
	      zipbox = [], zipobj = {}, start = idbox.start,
		    move = idbox.move,mains = [], end = idbox.end;

		// 1단계 : 스테이지명
			zipbox.push([stage])

				// 2단계 : 메인데이터
				for(var i in idbox){
					if( i == 'start'|| i == 'move' || i == 'end') continue;
					mains.push(idbox[i])
				}
			zipbox.push(mains);

		// Count numbers of start, end, move data set
		if(stage == 1){

			for(var i in start){

				var temp =[];

				//Compress keys
				keygroup = Object.keys(start)
					temp.push(keygroup)

					//Compress start data
					temp.push(start[i])

					//Compress move data	 
					for(var j in move){
						temp.push(move[j][i]);
					}
				//Compress end data
					temp.push(end[i]);

					zipbox.push(temp);
				}

			if(lzw == true){
				zipbox = $.rd.lzw_encode(zipbox)
					zipbox = JSON.stringify(zipbox)		

			}
			else{ zipbox = JSON.stringify(zipbox)	 }

			return  zipbox


		}

		if(stage == 2){
			
			var temp = [];
			temp.push(Object.keys(start))
			temp.push(start);

			for(var i=0, j = move.length; i< j; i++){
				temp.push(move[i]);
			}
			temp.push(end)
		  zipbox.push(temp);

			if(lzw == true){
					zipbox = JSON.stringify(zipbox)		
					zipbox = $.rd.lzw_encode(zipbox)

			}
			else{ zipbox = JSON.stringify(zipbox)	 }

			return  zipbox


		}

			
		},

/*
 * calculate localStorage total size
 * KB
 */ 
		getLocalsize : function(){
	var allStrings = '';
	for(var key in window.localStorage){
		if(window.localStorage.hasOwnProperty(key)){
			allStrings += window.localStorage[key];
		}
	}
	return allStrings ? 3 + ((allStrings.length*16)/(8*1024)) : 0;
},

 saveLocal : function(name,data){

	localStorage.setItem(name,data);

 },

 saveCookie : function(name,data){

  document.cookie = name + "=" + escape( data )

 },


 
 listify : function(touchobj){

	 var lists ={}

	 if(typeof touchobj == 'object'){
		 for(var i in touchobj){
			 if(i == 'target'){

				 for(var j in touchobj['target']){
					 if(typeof touchobj['target'][j] === 'function' || typeof touchobj['target'][j] === 'object') continue;
					 lists[j] = touchobj['target'][j]}
			 }
			 if(i == 'target') continue
				 lists[i] = touchobj[i]
		 }
	 }
	 return lists
 }


 },
 /*
	* 유저데이터를 받아서 리턴한다
	* Config 데이터
	*
	*/
 
  ud :function(config){
	var config =config;  //$_ = key;

	this.init = {	  
		sessionid : io.sockets[serverUrl].sessionid,
    // key
		key_exist : this.isExist(),
    originalkey : this.getKey(),
		storage : this.isStorage(config),
		device : this.isMobile(),
		timestamp : this.getTime(),
    // let's handle geo lateley
		//geodata : this.getGeodata(_$),
		browser : this.searchString(this.dataBrowser) || "An unknown browser",
		version : this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version",
		OS : this.searchString(this.dataOS) || "an unknown OS",
		usedmemory : this.getMemory(),
		memoryratio : this.getmemoryRatio(),
		loadingtime : this.getTimings()
		}
  }


}// end $




/*

$.tr.prototype.searchRemanings = function(){
}

$.rd.prototype.save = function(option){
}

*/


/*
$.rd.prototype.trafficManager = function(trffic){
var option =traffic.option,
    kb = traffic.kb,
    time = tarffic.time,
    query = traffic.query;
}

$.rd.prototype.trafficCounter = function(){
	this.queries;
	this.gestures;
	this.kbs;


}


$.rd.prototype.trafficListenter = function(option){
	var opt = option;
	if(option == 'kb'){


	}
}

$.rd.prototype.trafficTimer = function(time){
}
*/
/*
$.zd.prototype.setZip = function(box){
}
*/
/*
 * configure 파일 validation
 * param : configure json
 */
/*
$.ud.prototype.cval = function(j){
}
*/
/*
 * conrigure 파일 옵션체크
 * param : configure json
 */
/*
$.ud.prototype.cchek = function(j){
}
*/
$.ud.prototype.isPerformance = function(item){
var item = item;
if(typeof item == 'undefined' || 'null') {
	return false}
else { return item}
}

$.ud.prototype.getCookie = function( cookieName ){
	var search = cookieName + "=",
			cookie = document.cookie;
	if( cookie.length > 0 ){
		startIndex = cookie.indexOf( cookieName );
		if( startIndex != -1 ){
			startIndex += cookieName.length;
			endIndex = cookie.indexOf( ";", startIndex );
			if( endIndex == -1) endIndex = cookie.length;
			return unescape( cookie.substring( startIndex + 1, endIndex ) );
		}
		else{ return false; }
	}
	else { return false; }
}

	
$.ud.prototype.setCookie = function( cookieName, cookieValue, expireDate ){
	if(expireDate){	
		var today = new Date();
		today.setDate( today.getDate() + parseInt( expireDate ) );
		document.cookie = cookieName + "=" + escape( cookieValue ) + "; path=http://gesturetrain.com/; expires=" + today.toGMTString() + ";";
	}
	else{
		document.cookie = cookieName + "=" + escape( cookieValue )
	}
}

	
$.ud.prototype.deleteCookie = function( cookieName ){
	var expireDate = new Date();

	//어제 날짜를 쿠키 소멸 날짜로 설정한다.
	expireDate.setDate( expireDate.getDate() - 1 );
	document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
}


$.ud.prototype.makeGtcc = function(num){
	var xKey='';
	for(var i=0;i<num;i++){
		var rand = Math.floor(Math.random() * 100)+10;
		if(rand > 50){
			xKey += String.fromCharCode((Math.random() * 26) +65);
		}else{
			xKey += String.fromCharCode((Math.random() * 26) +97);
		}
		xKey += Math.floor(Math.random()*11);  
	}
	return xKey
}

$.ud.prototype.getKey = function(){
	if(window.localStorage){
	var gtccs = window.localStorage.getItem('gtcc');
    if(!gtccs) { return false }
    else { return gtccs }
  }
  else{
	var gtccc = this.getCookie('gtcc');
	if(!gtccc) { return false } 
  else { return	gtccc }
	}
}


$.ud.prototype.isKey = function(){
	if(window.localStorage){
	var gtccs = window.localStorage.getItem('gtcc');
    if(!gtccs) { return false }
    else { return 'localStorage' }
  }
  else{
	var gtccc = this.getCookie('gtcc');
	if(!gtccc) { return false } 
  else { return	'cookie' }
	}
}


$.ud.prototype.isExist = function(){
	if(window.localStorage){
	var gtccs = window.localStorage.getItem('gtcc');
    if(!gtccs) { return false }
    else { return true }
  }
  else{
	var gtccc = this.getCookie('gtcc');
	if(!gtccc) { return false } 
  else { return	true }
	}
}

$.ud.prototype.isLocal = function(){
	if(('localStorage' in window) && window['localStorage'] !== null) { return true }
	else { return false }
}

$.ud.prototype.isStorage = function(c){
  var config = c;
  if(config){
	var storeopt = config.gtcc_STORAGE 
  } 
	var islocal = this.isLocal();
	if(storeopt == 'localStorage' && islocal == true){
		return 'localStorage';
	}
	else { return 'cookie' }
}

$.ud.prototype.saveKey = function(key,config){
	var exp = config.gtcc_COOKIE_EXP;	
	var store = this.isStorage(config);
  var k = key

	if(store.toLowerCase() == 'localStorage'.toLowerCase()){	
		localStorage.setItem('gtcc', k); 
	}
	// 지정 저장소가 cookie 일때
	// 즉, 사용자가 원하지 않거나, 브라우저가 지원하지 않을때
	else { 
		// 만료 옵션이 설정되어 있을때
		if(typeof exp == 'number' && exp >0){
			this.setCookie('gtcc', k, exp);
		}
		// 만료 옵션이 설정되어 있지 않을때.
		else if(exp == false){	
			this.setCookie('gtcc', k)
		}
		// 무언가 설정에 문제가 있을때
		else { return false}		   
	}
}

$.ud.prototype.changeKey = function(key,config){
	// 키가 있을때( 설정을 변경한경우, 키 저장소를 옮기다) 
	// 설정된 저장소와 현재 저장된 저장소가 다를떄.
	// 만일 로컬을 지원하지 않아 쿠키설정자가 로컬로 바꿔도 소용없다.
	// 그럴경우 store는 쿠키로 설정되기 떄문이다.
	// 만일. 로컬을 지원하지만 쿠키 설정저가 로컬로 바꿀땐
	// 설정을 변경후 store가 로컬로 바뀌기 떄문에 해당 옵션이 실행된다
	// 반대로 로컬지정자가 쿠키로 바뀔때도 마찬가지다
	// 즉 스와핑 하면된다. 
	var wherekey = this.isKey();
	var exp = config.gtcc_COOKIE_EXP;	
	var store = this.isStorage(config);

	if(store.toLowerCase() !== wherekey.toLowerCase()){
		// 저장된 키를 복사한다
		var clone = this.getKey();

		// 현 저장소의 키를 삭제한다
		this.eraseKey(wherekey)

			// 현재 쿠키일떄, 로컬에 저장한다
			if(wherekey == 'cookie'){
				localStorage.setItem('gtcc', clone); 
			}
		// 현재 로컬일떄, 쿠키에 저장한다
		if(wherekey =='localStorage'){
			if(typeof exp == 'number' && exp >0){
				this.setCookie('gtcc', clone, exp);
			}
			// 만료 옵션이 설정되어 있지 않을때.
			else if(exp == false){	
				this.setCookie('gtcc', clone)
			}
		}
	}
}
$.ud.prototype.newKey = function(){
	var wowkey = this.make_Gtcc(_$.gtcc_LENGTH);
	var exp = this._$.gtcc_COOKIE_EXP	
		var store = this.isStorage();

	if(store == 'localStorage'){	
		localStorage.setItem('gtcc', wowkey); 
	}

	else { 
		if(typeof exp == 'number' && exp >0){
			setCookie('gtcc', wowkey, exp);
		}
		else if(exp == false){	
			setCookie('gtcc', wowkey)
		}
		else { alert('컨트롤러 쿠키 exp 에러. 담당자에게 문의하세요') }		   
	}

	return wowkey
}


$.ud.prototype.eraseKey = function(where){
  var where = where
	if(where =='localStorage'){
		localStorage.removeItem('gtcc') }

	if(where == 'cookie'){
		deleteCookie('gtcc') } 

	else {return  false }
}

$.ud.prototype.isMobile = function(){
	var filter = "win16|win32|win64|mac";
	if( navigator.platform  ){
		if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
			return 'mobile'
		}else{
			return 'pc'
		}
	}
}

$.ud.prototype.getTime = function(){

	var now = new Date(),
			year = now.getFullYear(),
			month =(now.getMonth()+1),
			date  = now.getDate(), 
			hours = now.getHours(),
			minute = now.getMinutes(),
			second = now.getSeconds(),
			day = now.getDay();

	return {'year' : year, 'month' : month, 'date' : date, 'hours' : hours,
		'minute' : minute, 'second' : second, 'day' : day }
}

$.ud.prototype.getGeodata = function(c){
	var _$ =c
	if(_$.visitor_GEODATA == true && window.navigator.geolocation){
			navigator.geolocation.getCurrentPosition(this.showGeo)
		}

	if(_$.visitor_GEODATA == false){
		return false
	}
}

$.ud.prototype.showGeo = function(position){
	return {
		         latitude : position.coords.latitude,
						 longtitude :position.coords.longitude,
						 accuracy : position.coords.accuracy,
						 altitude : position.coords.altitude,
						 altitudeAccuracy : position.coords.altitudeAccuracy,
						 heading : position.coords.heading,
						 speed : position.coords.speed,
						 timestamp : position.timestamp }
}


$.ud.prototype.searchString = function (data) {
	for (var i=0;i<data.length;i++)	{
		var dataString = data[i].string;
		var dataProp = data[i].prop;
		this.versionSearchString = data[i].versionSearch || data[i].identity;
		if (dataString) {
			if (dataString.indexOf(data[i].subString) != -1)
				return data[i].identity;
		}
		else if (dataProp)
			return data[i].identity;
	}
}

$.ud.prototype.searchVersion = function (dataString) {
	var index = dataString.indexOf(this.versionSearchString);
	if (index == -1) return;
	return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
}

$.ud.prototype.dataBrowser = [
{
	string: navigator.userAgent,
	subString: "Chrome",
	identity: "Chrome"
},
{ 	string: navigator.userAgent,
	subString: "OmniWeb",
	versionSearch: "OmniWeb/",
	identity: "OmniWeb"
},
{
	string: navigator.vendor,
	subString: "Apple",
	identity: "Safari",
	versionSearch: "Version"
},
{
	prop: window.opera,
	identity: "Opera",
	versionSearch: "Version"
},
{
	string: navigator.vendor,
	subString: "iCab",
	identity: "iCab"
},
{
	string: navigator.vendor,
	subString: "KDE",
	identity: "Konqueror"
},
{
	string: navigator.userAgent,
	subString: "Firefox",
	identity: "Firefox"
},
{
	string: navigator.vendor,
	subString: "Camino",
	identity: "Camino"
},
{		// for newer Netscapes (6+)
	string: navigator.userAgent,
	subString: "Netscape",
	identity: "Netscape"
},
{
	string: navigator.userAgent,
	subString: "MSIE",
	identity: "Explorer",
	versionSearch: "MSIE"
},
{
	string: navigator.userAgent,
	subString: "Gecko",
	identity: "Mozilla",
	versionSearch: "rv"
},
{ 		// for older Netscapes (4-)
	string: navigator.userAgent,
	subString: "Mozilla",
	identity: "Netscape",
	versionSearch: "Mozilla"
}
],

$.ud.prototype.dataOS = [
{
	string: navigator.platform,
	subString: "Win",
	identity: "Windows"
},
{
	string: navigator.platform,
	subString: "Mac",
	identity: "Mac"
},
{
	string: navigator.userAgent,
	subString: "iPhone",
	identity: "iPhone/iPod"
},
{
	string: navigator.platform,
	subString: "Linux",
	identity: "Linux"
}
]

$.ud.prototype.getMemory = function(){
	if(window.performance && window.performance.memory){
	return window.performance.memory}

	else { return false }
}

$.ud.prototype.getmemoryRatio = function(){
  if(window.performance && window.performance.memory){	
	var ratio =0;
	var mem = window.performance.memory
	ratio =mem.totalJSHeapSize/mem.jsHeapSizeLimit
		return ratio * 100}

	else { return false }
}

$.ud.prototype.getTimings = function(){
	if(window.performance && window.performance.timing){
    return window.performance.timing
	}
	else { return false }
}

