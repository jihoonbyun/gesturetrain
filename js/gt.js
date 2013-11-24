// GestureTrain v1.0.0 (client-side tracker)
// 2013.11.23 written by jhb (beagledog@naver.com)

/* 터치 이벤트 리스너 등록 (작동이 제대로 되지 않음)
  window.addEventListener('touchstart', $.rd, false);
  window.addEventListener('touchend', $.rd, false); 
  window.addEventListener('touchmove', $.rd, false);
*/

	// 터치 이벤트 리스너
	jQuery(window).on('touchstart',filter);
	jQuery(window).on('touchend',filter);
	jQuery(window).on('touchmove',filter);

  // 이벤트 필터링
  // 이유는 모르겠으나 필터링을 해줘야함	
	function filter(e){
		if(e.type == 'touchstart'){ $.tos(e); }
		if(e.type == 'touchend'){ $.toe(e); }
		if(e.type == 'touchmove') { $.tom(e); }
	}


/*
 * 서버컨넥션
 * socket.io
 */
 var serverUrl = 'http://beagledog11111.cafe24.com:8002';
 var socket = io.connect(serverUrl);
  socket.on('config', function(config){ 
   var config = config
   var ud= new $.ud(config);
   var x = ud.init 
console.log(x);	
   socket.emit('userdata', x);

 // 인증을받았을때, 터치데이터 전송을 시작한다
 socket.on('confirm', function(start){
   
   // 허용되었을때
   if(start.type == 'permitted') {
     var newkey = start.newkey;
     var exist = ud.isExist();

     // 같은 함수로 묶지 않은이유는 socket.io가
     // 간혹 configure 파일을 재 갱신하지 못하기 때문이다

     // 키가 존재하지 않을떄 
     if(exist == false){
      ud.saveKey(newkey,config);
     }

     // 키가 존재할떄
     if(exist == true){
       ud.changeKey(newkey,config)
      }
 
     socket.emit('touches', $.Recordbox);
   }


  }) // confirmed
 }) // config

/*
 * 유저데이터를 받아서 리턴한다
 * Config 데이터
 *
 */

 var $ = {
  
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
    dict = {}, data = (s + "").split(""), currChar = data[0],
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
    return out.join("");
  },


// 방향각도 구하기
getDirection : function(id){
    
		var g = $.Recordbox[id],
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
	var set =  $.movings[id],
			leng = set.length;

	// 핀치 or 스프레드 일때
	// 손가락이 두개 올려져있을때만 판단한다
	if(set){
		if (leng = 2){

			var a = set[0],
					b = set[1],
					first_distance = this.distance_two(a.start, b.start),
					last_distance = this.distance_two(a.end, b.end)

						first_distance > last_distance ? true : false
		}
	}
},

// touchstart 핸들러
 tos : function(e){
console.log('st')		
		var touches = e.originalEvent.touches,
		    leng = touches.length;

		// 아이디박스를 최초로 생성한다
		var newid = new $.idbox();
		
		// 아이디를 현재 올려져있는 터처 중 가장 나중에 것을 선택한다
		newid.id = touches[leng-1]['identifier'];
		
		// start에 해당 이벤트 객체를 집어 넣는다.
		newid['start'] = touches[leng-1]
		
		// elapsed에 해당 이벤트 객체의 최초 시간을 집어 넣는다.
		newid['elapsed'] = e.timeStamp

    newid['starttime'] = e.timeStamp
    
    // 리코드박스에 해당 객체 아이디명을 키값으로, 아이디박스를 객체로 넣는다		
	  $.Recordbox[newid.id] = newid
	
	},


// touchmove 핸들러
tom : function(e){
		e.preventDefault()
		var mov = e.originalEvent.touches,
		    moves = [];
	  
	  // 현재 움직이는 터치의 갯수를 반복문 돌린다	
		for(var i=0,mleng = mov.length;i<mleng;i++){

			// 움직이는 터치의 아이디 추출
			var movid = mov[i]['identifier']

			// 리코드 박스에서 움직이는 터치 아이디를 찾아 move에 이벤트 객체 넣기
			$.Recordbox[movid]['move'].push(mov[i]);

			// 한번에 움직이는 손가락이 두개 이상일 때
			if(mleng >1){

				// 리코드박스에 움직이는 손가락 아이디 찾아서 스탯에 멀티 추가
				$.Recordbox[movid]['stat'] = 'multi';
				
				// 무브스에 해당 아이디 집어넣기
				moves.push(movid);
			}
		}
		// 무부스를 키값으로하고, 무부스아이디 묶음을 집어넣기
		$.movings[moves[0]] = moves;
	},


// touchend 핸들러	
toe : function(e){
	var end = e.originalEvent.changedTouches,
			endid = end[0]['identifier'],
			result = parseInt(e.timeStamp - $.Recordbox[endid]['elapsed']);

	// 리코드박스에서 끝난 터치의 아이디 찾아서 end에 이벤트객체 넣기	
	$.Recordbox[endid]['end'] = end[0];

	// elapsed에 끝난시간에서 현재 현재시간을 뺀다
	$.Recordbox[endid]['elapsed'] = result

  $.Recordbox[endid]['endtime'] = e.timeStamp

		// 겟 제스처 함수 실행
		//this.getGesture(endid);
},


getGesture : function(id){
    var id = id;
		var moment = $.Recordbox[id],
		    stat = moment['stat'],
		    leng = $.Recordbox.length,
		    mx = moment['pageX'],
		    my = moment['pageY'];

		
		var id = parseInt(id),
		    before = $.Recordbox[id-1],
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
         var is = this.isPinch(id) 
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

		var rb = $.Recordbox[id],
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
		var gb = new $.gbox();

		// 제스처 정보 알아내기
		gb.gesture = this.getGesuture(id)

		// 스타트 타임 알아내기
		gb.startime = this.starttime

		// 엔드 타임 알아내기
		gb.endtime = this.endtime

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
		xdata = lzw_encode(xdata);
		ydata = lzw_encode(ydata);

		// 무빙셋에 넣기
		gb.movingset = [xdata, ydata]

    $.Gesturebox.push(gb);
 }, 
 
  ud :function(config){
	var config =config;  //$_ = key;

	this.init = {	  
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
  },

  tr : function(controller){
   // ....localStorage.setItem($.rd.Recordbox)
  }
}




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
		document.cookie = cookieName + "=" + escape( cookieValue ) + "; path=/; expires=" + today.toGMTString() + ";";
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

