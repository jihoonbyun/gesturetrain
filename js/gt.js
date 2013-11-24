// GestureTrain v1.0.0 (client-side tracker)
// 2013.11.23 written by jhb (beagledog@naver.com)

/* ��ġ �̺�Ʈ ������ ��� (�۵��� ����� ���� ����)
  window.addEventListener('touchstart', $.rd, false);
  window.addEventListener('touchend', $.rd, false); 
  window.addEventListener('touchmove', $.rd, false);
*/

	// ��ġ �̺�Ʈ ������
	jQuery(window).on('touchstart',filter);
	jQuery(window).on('touchend',filter);
	jQuery(window).on('touchmove',filter);

  // �̺�Ʈ ���͸�
  // ������ �𸣰����� ���͸��� �������	
	function filter(e){
		if(e.type == 'touchstart'){ $.tos(e); }
		if(e.type == 'touchend'){ $.toe(e); }
		if(e.type == 'touchmove') { $.tom(e); }
	}


/*
 * �������ؼ�
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

 // �������޾�����, ��ġ������ ������ �����Ѵ�
 socket.on('confirm', function(start){
   
   // ���Ǿ�����
   if(start.type == 'permitted') {
     var newkey = start.newkey;
     var exist = ud.isExist();

     // ���� �Լ��� ���� ���������� socket.io��
     // ��Ȥ configure ������ �� �������� ���ϱ� �����̴�

     // Ű�� �������� ������ 
     if(exist == false){
      ud.saveKey(newkey,config);
     }

     // Ű�� �����ҋ�
     if(exist == true){
       ud.changeKey(newkey,config)
      }
 
     socket.emit('touches', $.Recordbox);
   }


  }) // confirmed
 }) // config

/*
 * ���������͸� �޾Ƽ� �����Ѵ�
 * Config ������
 *
 */

 var $ = {
  
  Recordbox : {},

	Gesturebox : [],

  Count : 0, // start -end ��Ʈ ����
  
  totalCount : 0, //��� ����
  
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
	 this.movingset =[] // ���� �����͸� x,y�� ���� �����ؼ� ����
  },

  // ��Ÿ��� 
  distance_two  : function(pt, pt2) {

	var x2 = Math.pow((pt[0]-pt2[0]),2),
	    y2 = Math.pow((pt[1]-pt2[1]),2);

	return Math.sqrt((x2+y2));
  },

  // ���� ���ϱ�
  getAngle : function(P1, P2){

  var deltaY = P2.y - P1.y,
      deltaX = P2.x - P1.x,
      degree = Math.atan2(deltaY / deltaX) * 180 / Math.PI
	return degree;
  },

  // lzw ���ڵ� ���ڵ�(https://gist.github.com/revolunet/843889)
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


// ���Ⱒ�� ���ϱ�
getDirection : function(id){
    
		var g = $.Recordbox[id],
		    stat = g['stat'],
		    gm = g.move,
		    l = gm.length,
		    sc = g.start.pageX - g.end.pageX,
		    e = g.start.pageY - g.end.pageX,
		    direction = []

		// direction ����
		if(sc <0) { g['direction'][0] = 'right'}
		if(sc =0) { g['direction'][0] = 'same'}
		if(sc >0) { g['direction'][0] ='left'}

		if(ec <0) { g['direction'][0] = 'up' }
		if(ec =0) { g['direction'][0] ='same' }
		if(ec >0) { g['direction'][0] ='down' }	

},

// ��ġ���� ������������
isPinch : function(id){
	var set =  $.movings[id],
			leng = set.length;

	// ��ġ or �������� �϶�
	// �հ����� �ΰ� �÷����������� �Ǵ��Ѵ�
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

// touchstart �ڵ鷯
 tos : function(e){
console.log('st')		
		var touches = e.originalEvent.touches,
		    leng = touches.length;

		// ���̵�ڽ��� ���ʷ� �����Ѵ�
		var newid = new $.idbox();
		
		// ���̵� ���� �÷����ִ� ��ó �� ���� ���߿� ���� �����Ѵ�
		newid.id = touches[leng-1]['identifier'];
		
		// start�� �ش� �̺�Ʈ ��ü�� ���� �ִ´�.
		newid['start'] = touches[leng-1]
		
		// elapsed�� �ش� �̺�Ʈ ��ü�� ���� �ð��� ���� �ִ´�.
		newid['elapsed'] = e.timeStamp

    newid['starttime'] = e.timeStamp
    
    // ���ڵ�ڽ��� �ش� ��ü ���̵���� Ű������, ���̵�ڽ��� ��ü�� �ִ´�		
	  $.Recordbox[newid.id] = newid
	
	},


// touchmove �ڵ鷯
tom : function(e){
		e.preventDefault()
		var mov = e.originalEvent.touches,
		    moves = [];
	  
	  // ���� �����̴� ��ġ�� ������ �ݺ��� ������	
		for(var i=0,mleng = mov.length;i<mleng;i++){

			// �����̴� ��ġ�� ���̵� ����
			var movid = mov[i]['identifier']

			// ���ڵ� �ڽ����� �����̴� ��ġ ���̵� ã�� move�� �̺�Ʈ ��ü �ֱ�
			$.Recordbox[movid]['move'].push(mov[i]);

			// �ѹ��� �����̴� �հ����� �ΰ� �̻��� ��
			if(mleng >1){

				// ���ڵ�ڽ��� �����̴� �հ��� ���̵� ã�Ƽ� ���ȿ� ��Ƽ �߰�
				$.Recordbox[movid]['stat'] = 'multi';
				
				// ���꽺�� �ش� ���̵� ����ֱ�
				moves.push(movid);
			}
		}
		// ���ν��� Ű�������ϰ�, ���ν����̵� ������ ����ֱ�
		$.movings[moves[0]] = moves;
	},


// touchend �ڵ鷯	
toe : function(e){
	var end = e.originalEvent.changedTouches,
			endid = end[0]['identifier'],
			result = parseInt(e.timeStamp - $.Recordbox[endid]['elapsed']);

	// ���ڵ�ڽ����� ���� ��ġ�� ���̵� ã�Ƽ� end�� �̺�Ʈ��ü �ֱ�	
	$.Recordbox[endid]['end'] = end[0];

	// elapsed�� �����ð����� ���� ����ð��� ����
	$.Recordbox[endid]['elapsed'] = result

  $.Recordbox[endid]['endtime'] = e.timeStamp

		// �� ����ó �Լ� ����
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


		// ���ڵ� �ڽ��� ���̵�ڽ��� �����Ҷ�
		if(leng >0){

			// �ش� ���̵�ڽ��� ������ ��Ƽ�϶�
			// �� ��ũ���� �μ��̻��� �÷��� �־�����.

			if( stat == 'multi'){

				// ��ġ�̸� ��ġ�Լ� �߻�
				// ��������� ���������Լ� �߻�
         var is = this.isPinch(id) 
				return is ? 'pinch' : 'spread';
				
			} // ��Ƽ ��


			// �ش� ���̵�ڽ��� ������ �̱��ϋ�
			// �� ��ũ���� �Ѽո��� �÷��� �־�����
			if(stat == 'single'){

				// ���갡 �߻������� �巡�� �Լ� �߻�
				var mleng = moment['move'].length;
				mleng > 0 ? 'drag' :

				// ��ŸƮ���� ������� 1�� �̻� ������
				// �����Լ� �߻�
				moment['elapsed'] >= 1000 ? 'longtab' : 

				// elapsed Ÿ���� 1�� �������ٰ� x,y��ǥ�� 5�����̸� ������
				// �ƹ��͵� �ƴϸ� ��
				before['elapsed'] < 1000 && chx <6 && chy<6 ? 'doubletab' : 'tab'

			} // �̱� ��
		}
	}, // �˰��� ��



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

		// gbox �ν��Ͻ� ����
		var gb = new $.gbox();

		// ����ó ���� �˾Ƴ���
		gb.gesture = this.getGesuture(id)

		// ��ŸƮ Ÿ�� �˾Ƴ���
		gb.startime = this.starttime

		// ���� Ÿ�� �˾Ƴ���
		gb.endtime = this.endtime

		// ��ŸƮ ����Ʈ
		gb.startpoint = p1

		// ���� ����Ʈ
		gb.endpoint = p2

		// ���������� ���� �ֱ�
		for(var i=0, mleng = rb.move.length; i<mleng;i++){
		xdata.push(rb.move[i][0]);
		ydata.push(rb.move[i][1]);
		}

		// �����ϱ�
		xdata = lzw_encode(xdata);
		ydata = lzw_encode(ydata);

		// �����¿� �ֱ�
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
 * configure ���� validation
 * param : configure json
 */
/*
$.ud.prototype.cval = function(j){
}
*/
/*
 * conrigure ���� �ɼ�üũ
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

	//���� ��¥�� ��Ű �Ҹ� ��¥�� �����Ѵ�.
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
	// ���� ����Ұ� cookie �϶�
	// ��, ����ڰ� ������ �ʰų�, �������� �������� ������
	else { 
		// ���� �ɼ��� �����Ǿ� ������
		if(typeof exp == 'number' && exp >0){
			this.setCookie('gtcc', k, exp);
		}
		// ���� �ɼ��� �����Ǿ� ���� ������.
		else if(exp == false){	
			this.setCookie('gtcc', k)
		}
		// ���� ������ ������ ������
		else { return false}		   
	}
}

$.ud.prototype.changeKey = function(key,config){
	// Ű�� ������( ������ �����Ѱ��, Ű ����Ҹ� �ű��) 
	// ������ ����ҿ� ���� ����� ����Ұ� �ٸ���.
	// ���� ������ �������� �ʾ� ��Ű�����ڰ� ���÷� �ٲ㵵 �ҿ����.
	// �׷���� store�� ��Ű�� �����Ǳ� �����̴�.
	// ����. ������ ���������� ��Ű �������� ���÷� �ٲܶ�
	// ������ ������ store�� ���÷� �ٲ�� ������ �ش� �ɼ��� ����ȴ�
	// �ݴ�� ���������ڰ� ��Ű�� �ٲ𶧵� ����������
	// �� ������ �ϸ�ȴ�. 
	var wherekey = this.isKey();
	var exp = config.gtcc_COOKIE_EXP;	
	var store = this.isStorage(config);

	if(store.toLowerCase() !== wherekey.toLowerCase()){
		// ����� Ű�� �����Ѵ�
		var clone = this.getKey();

		// �� ������� Ű�� �����Ѵ�
		this.eraseKey(wherekey)

			// ���� ��Ű�ϋ�, ���ÿ� �����Ѵ�
			if(wherekey == 'cookie'){
				localStorage.setItem('gtcc', clone); 
			}
		// ���� �����ϋ�, ��Ű�� �����Ѵ�
		if(wherekey =='localStorage'){
			if(typeof exp == 'number' && exp >0){
				this.setCookie('gtcc', clone, exp);
			}
			// ���� �ɼ��� �����Ǿ� ���� ������.
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
		else { alert('��Ʈ�ѷ� ��Ű exp ����. ����ڿ��� �����ϼ���') }		   
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

