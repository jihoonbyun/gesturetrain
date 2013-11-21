// 클라이언트를 식별할 수 있는 고유 키를 생성
// 키를 저장하고 다시 재저장하는 방식
// 로컬스토리지 저장방식과 쿠키저장방식이 있음
// include Controller, Utils

var Key = {

function init(){
	this.key_exist = isExist(); // true or false
	this.storage = isStorage(); // 저장소
	this.key = autoKey(); // 키값(기존꺼일수도, 새로운것일수도)
},

// 쿠키 함수 세트
function getCookie( cookieName ){
	var search = cookieName + "=";
	var cookie = document.cookie;
	if( cookie.length > 0 )
	{
		// 해당 쿠키명이 존재하는지 검색한 후 존재하면 위치를 리턴.
		startIndex = cookie.indexOf( cookieName );
		// 만약 존재한다면
		if( startIndex != -1 )
		{
			// 값을 얻어내기 위해 시작 인덱스 조절
			startIndex += cookieName.length;
			// 값을 얻어내기 위해 종료 인덱스 추출
			endIndex = cookie.indexOf( ";", startIndex );
			// 만약 종료 인덱스를 못찾게 되면 쿠키 전체길이로 설정
			if( endIndex == -1) endIndex = cookie.length;
			// 쿠키값을 추출하여 리턴
			return unescape( cookie.substring( startIndex + 1, endIndex ) );
		}
		else
		{
			// 쿠키 내에 해당 쿠키가 존재하지 않을 경우
			return false;
		}
	}
	else
	{
		// 쿠키 자체가 없을 경우
		return false;
	}
},

/**
 * 쿠키 설정
 * @param cookieName 쿠키명
 * @param cookieValue 쿠키값
 * @param expireDay 쿠키 유효날짜
 */
	function setCookie( cookieName, cookieValue, expireDate ){
		if(expireDate){	
			var today = new Date();
			today.setDate( today.getDate() + parseInt( expireDate ) );
			document.cookie = cookieName + "=" + escape( cookieValue ) + "; path=/; expires=" + today.toGMTString() + ";";
		}
		else{
			document.cookie = cookieName + "=" + escape( cookieValue )
		}
	},

/**
 * 쿠키 삭제
 * @param cookieName 삭제할 쿠키명
 */
function deleteCookie( cookieName ){
	var expireDate = new Date();

	//어제 날짜를 쿠키 소멸 날짜로 설정한다.
	expireDate.setDate( expireDate.getDate() - 1 );
	document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
},


// 고유 아이디키 생성
function makeGtcc(num){
	var xKey="";
	for(var i=0;i<num;i++){
		var rand = Math.floor(Math.random() * 100)+10;
		if(rand > 50){
			xKey += String.fromCharCode((Math.random() * 26) +65);
		}else{
			xKey += String.fromCharCode((Math.random() * 26) +97);
		}
		xKey += Math.floor(Math.random()*11);  
	}
	return lzw_encode(xKey)
},

// 로컬스토리지 혹은 쿠키에 키가 있는지 확인한다
// 키가있다면 해당 저장소를 리턴하고 없으면 false
function isKey(){
	
	var gtccs = window.localStorage.getItem('gtcc');
	var gtccc = this.getCookie('gtcc');
	if(gtccs) return gtccs 
	else if(gtccc) return gtccc
	else return false
},

// 불린함수
funtion isExist(){
	var gtccs = window.localStorage.getItem('gtcc');
	var gtccc = this.getCookie('gtcc');
  gtccs || gtccc ? true : false

},

function isLocal(){
	if(('localStorage' in window) && window['localStorage'] !== null) { return true }
	else { return false }
},



// 지원 스토리지
function isStorage(){
	var storeopt = Controller.gtcc_STORAGE
	var islocal = isLocal();
	if(storeopt == 'localStorage' && islocal == true){
			return 'localStorage';
	  }
	else { return 'cookie' }
},

function newKey(){
	    var wowkey = make_gtcc(Controller.gtccnumber);
		  var exp = Controller.gtcc_COOKIE_EXP	
			var store = isStorage();
		  
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
},

// 키가 있는지 없는지 체크
// 키가 없으면 바로 생성해서 리턴
function autokey(){
	 var iskey = isKey();
	 var key ='';
		if(iskey == false){ key = newKey(); return key;} 
	  else { return isKey } 	
},

// 키를 삭제
function eraseKey(){
  var key = isKey();
	if(key =='localStorage'){
 	localStorage.removeItem('gtcc') }

	if(key == 'cookie'){
  deleteCookie('gtcc') } 
 
	else {return  false }
},
}
