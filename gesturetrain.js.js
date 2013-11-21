// 클라이언트 페이지 부분


	// 접속자 정보(아이피,세션아이디,기종,브라우저,버전정보 등)
	// 줌인/ 줌아웃
	// 스크롤 스코롤 위치 및 길이 시간 리턴
	// 틸트 위치 시기
	// 문자입력 정보

// 모바일 접속여부
/*
if (navigator.userAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || navigator.userAgent.match(/LG|SAMSUNG|Samsung/) != null) {
  A;
}
else {
 B";
}
//다른방법

   var filter = "win16|win32|win64|mac";
 
    if( navigator.platform  ){
        if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
            alert("모바일 기기에서 접속");
        }else{
            alert("PC에서 접속");
        }
    }

$(document).ready(function () {
    $.getJSON('http://smart-ip.net/geoip-json?callback=?', function(data) {
        $('p').html('My IP Address is: ' + data.host);
    });
});

5
});


*/


// 클라이언트 정보
Client= {
	ip: ip,
	sessionid : sessionid,
	currenturl : 0,
	currentpage : 0,
	currenttime : 0,
	lasttime : 0,
	currentposition : 0,
	settimeout : 0,
	browser : 0,
	time : 0,
	model : 0,
},

// 터치 이벤트 정보
/*
this.Touch = {
	start : 0,
	move : 0,
	end : 0,
	cancel : 0,
	indentifier : 0,
	screenx : 0,
	screeny : 0,
	pagex : 0,
	pagey : 0,
	target : 0
},
*/
// 안드로이드, 아이폰 지원 기본 모바일  제스처 8 개
//	var default = ['tab','double-tab','touch-hold','drag-flick','pinch','spread','swipe','etc']
// 추가 제스처
// var expansion = ['rotate','shake',2dragdown','2dragup','tilt','write','select'];

Gesture = function(ip,sessionid){

	this.tab = {'touchtime' : 0}

	





}


Handler = function(){

	var g = new Gesture(ip,sessionid)

  this.swipe = function(){



	}


};



Mapper();
Sender();




  // 이벤트 리스너 등록
	//
	//
  // 핸들러 클래스 상속 선언
	var h = new Handler();

   // 스크롤이 발생했을때
	jQuery(window).on('scroll', h.scroll);

	// 줌이 발생했을떄
	jQuery(window).on('resize', h.zoom);






