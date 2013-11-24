// GestureTrain v1.0.0 (client-side tracker)
// 2013.11.23 written by jhb (beagledog@naver.com)


/*
 * 서버컨넥션
 * socket.io
 */
 var serverUrl = 'http://beagledog11111.cafe24.com:8002';
 var socket = io.connect(serverUrl);
  socket.on('d', function(data){
	 var x = new ud(data);
	 var r = x.init();
	socket.emit('userdata', r);
  });

/*
 * 유저데이터를 받아서 리턴한다
 * Config 데이터
 */

 function ud(j){
	this._$ =j
	this.timings = window.performance.timing;
	this.memory = window.performance.memory;

	this.way = this._$.visitor_WAY;
	this.timelimit = this._$.visitor_TIME_LIMIT;
	this.memorylimit =this. _$.visitor_MEMORY_LIMIT;
	this.tarr = this._$.visitor_TIME_ARRAY;
 }

/*
 * configure 파일 validation
 * param : configure json
 */
ud.prototype.cval = function(j){
}

/*
 * conrigure 파일 옵션체크
 * param : configure json
 */
ud.prototype.cchek = function(j){
}

ud.prototype.init = function(){
	return {	 
	  // key
		key_exist : this.isExist(),
		storage : this.isStorage(),
		device : this.isMobile(),
		timestamp : this.getTime(),
		//geodata : this.getGeodata(),
		browser : this.searchString(this.dataBrowser) || "An unknown browser",
		version : this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version",
		OS : this.searchString(this.dataOS) || "an unknown OS",
		support : this.isSupport(),
		usedmemory : this.getMemory(),
		memoryratio : this.getmemoryRatio(),
		elapsedtime : this.getTimings(),
		danger : this.isDanger()
		}
}


 
ud.prototype.getCookie = function( cookieName ){
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

	
ud.prototype.setCookie = function( cookieName, cookieValue, expireDate ){
	if(expireDate){	
		var today = new Date();
		today.setDate( today.getDate() + parseInt( expireDate ) );
		document.cookie = cookieName + "=" + escape( cookieValue ) + "; path=/; expires=" + today.toGMTString() + ";";
	}
	else{
		document.cookie = cookieName + "=" + escape( cookieValue )
	}
}

	
ud.prototype.deleteCookie = function( cookieName ){
	var expireDate = new Date();

	//어제 날짜를 쿠키 소멸 날짜로 설정한다.
	expireDate.setDate( expireDate.getDate() - 1 );
	document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
}


ud.prototype.makeGtcc = function(num){
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

ud.prototype.isKey = function(){
	var gtccs = window.localStorage.getItem('gtcc');
	var gtccc = this.getCookie('gtcc');
	if(gtccs) return gtccs 
	else if(gtccc) return gtccc
	else return false
}

ud.prototype.isExist = function(){
	var gtccs = window.localStorage.getItem('gtcc');
	var gtccc = this.getCookie('gtcc');
	gtccs || gtccc ? true : false
}

ud.prototype.isLocal = function(){
	if(('localStorage' in window) && window['localStorage'] !== null) { return true }
	else { return false }
}

ud.prototype.isStorage = function(){
	var storeopt = this._$.gtcc_STORAGE
	var islocal = this.isLocal();
	if(storeopt == 'localStorage' && islocal == true){
		return 'localStorage';
	}
	else { return 'cookie' }
}

ud.prototype.newKey = function(){
	var wowkey = this.make_Gtcc(this._$.gtcc_LENGTH);
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

ud.prototype.autokey = function(){
	var iskey = this.isKey();
	var kj ='';
	if(iskey == false){ kj = this.newKey(); return kj;} 
	if(iskey) { return isKey } 	
}

ud.prototype.eraseKey = function(){
	var key = this.isKey();
	if(key =='localStorage'){
		localStorage.removeItem('gtcc') }

	if(key == 'cookie'){
		deleteCookie('gtcc') } 

	else {return  false }
}

ud.prototype.isMobile = function(){
	var filter = "win16|win32|win64|mac";
	if( navigator.platform  ){
		if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
			return 'mobile'
		}else{
			return 'pc'
		}
	}
}

ud.prototype.getTime = function(){

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

ud.prototype.isGeo = function(){
  navigator.geolocation ? navigator.geolocation.getCurrentPosition(this.getGeodata) : false;
}

ud.prototype.getGeodata = function(){
	this.isGeo();
	return {
		latitude : coords.latitude,
						 longtitude : coords.longitude,
						 accuracy : coords.accuracy,
						 altitude : coords.altitude,
						 altitudeAccuracy : coords.altitudeAccuracy,
						 heading : coords.heading,
						 speed : coords.speed,
						 timestamp : timestamp }
}


ud.prototype.searchString = function (data) {
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

ud.prototype.searchVersion = function (dataString) {
	var index = dataString.indexOf(this.versionSearchString);
	if (index == -1) return;
	return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
}

	ud.prototype.dataBrowser = [
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

	ud.prototype.dataOS = [
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

	
ud.prototype.isSupport  = function(){

	if(this.timings && this.memory) return 3
	else if(this.timings && !this.memory) return 1
	else if(this.memory && !this.timings) return 2
	else return false 
}

ud.prototype.getMemory = function(){
	return this.memory
}

ud.prototype.getmemoryRatio = function(){
	var ratio =0;
	ratio = this.memory.totalJSHeapSize/this.memory.jsHeapSizeLimit
		return ratio * 100
}

ud.prototype.getTimings = function(){
	var first = '', last = '',elapsed = 0;
	first = this.tarr[0],
				last = this.tarr[1];

	elapsed = Math.abs(this.timings[last] - this.timings[first])
		return elapsed
}

ud.prototype.isDanger = function(){
	if(this.way == 'time' && (this.support == 1||3)){
		(this.elapsedtime >= this.timelimit) ? true : false 
	}

	if(this.way == 'memory' && (this.support == 2||3)){
		(this.memoryratio >= this.memorylimit) ? true : false
	}
	if(this.way == 'both' && this.support >0){
		if((this.elapsedtime >= this.timelimit) || (this.memoryratio >= this.memorylimit)) {return true}
		else { return false}
	}
	else { return false}
}
