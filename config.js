
  //이 객체를 소켓아이오로 최초 handshake떄 서버에서 클라이언트로 전송
	// 이후 각종 클라이언트 모듈들 가동
  // 자동으로 설정들이 맞춰진다
	// 옵션을 끌경우 false 가 가능하다
	// if you want to switch off, just false
module.exports = Config = {	
	
	// key
	gtcc_ENCODING : true, // 키 압축 인코딩(lzw) 여부
	gtcc_STORAGE : 'localStorage',// localStorage or cookie. 사용할 스토리지. 로컬스토리지 지원안하면 자동으로 쿠키저장
	gtcc_COOKIE_EXP : 365, // 쿠키 유효기간. 오늘부터 몇일 후(false : 설정안함-세션)

	// traffic
	// 클라이언트 저장소에 저장해두었다가 전송하는 방식 설정
  // 일정시간방식 vs 일정용량방식 vs 일정쿼리수방식	
	// 실시간 메뉴를 클릭했을때만, 즉각적으로 보내며, 아닐경우는 로컬에 저장후 옵션에 따라 전송
	traffic_OPTION : 'time',	// auto, time, kb, query, realtime 중 택 1. 자동옵션은 세가지 옵션중 한가지만 충족하면 실행
	traffic_MAX_STORAGE_KB : 1024 * 1, // 용량방식일경우, 클라이언트의 로컬스토리지 전체 사용량 제한. 단위는 kb. 일반적으로 5mb까지 지원한다
  //traffic_MAX_COOKIE_NUMBER : 10, // 용량방식일경우,쿠키 하나 당 4096Byte. 도메인, 호스트 하나 당 20개 쿠키. 충 쿠키 갯수 300개. 최대 용량 : 1.2 MB
	traffic_TIME  : 1000, // 시간일경우, 3초마다
	traffic_QUERY : 3, // 터치쿼리가 4개 이상일 경우(터치쿼리란, 손가락을 데었다가 때는 한동작 이벤트데이터 세트 객체)
	

	// monitoring (설정하지 않을경우 = false)
	// monitoring -client
	monitor_SOCKET_CLIENT_SLOW : 450, // 클라이언트 -소켓io 1회 전송속도를 체크하여 일정속도 이상이 되면 서버로 alert
	monitor_SOCKET_CLIENT_REPEAT : 1000, // 클라이언트 -소켓io 분당 전송갯수를 체크하여 일정갯수 이상이면 alert
	monitor_BROWSER_CLIENT_MEMORY : false,// 클라이언트 브라우저의 메모리 데이터가 일정부분이상이면 얼러트
	monitor_BROWSER_CIENT_LOADING : false,// 클라이언트 브라우저의 로딩속도(전과정)가 일정부분이상이면 얼러트
	monitor_GEO_CLIENT_DISTANCE : 100, // km. 이전 접속시 위치에서 일정 km 떨어진곳이면 서버에 얼러트

	//monitoring -server
	// 전체 받는 것을 기준으로 한다
	monitor_SOCKET_SERVER_SLOW  : 9, // ms
	monitor_SOCKET_SERVER_QURIES : 10000, // min  
	monitor_CPU : false,
	monitor_MEMORY : false,

	// visitor
	visitor_GEODATA : true, // 방문자의 geo데이터를 수집할건지 설정. 유저에게 안내문이 뜬다

 // zipbox contains
 //
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
 // 주로 무브 데이터가 많을떄 탁월하다
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
 
	compress_LZW : false, // 약간의 문제가 있어서 일단 꺼놓는다.	
	compress_STAGE : 2,	// 압축단계 조절 1,2 번 중 선택 

		
	// security -server
	//security_LEVEL = 3,
	//securtiy_OPTION = 'DISCONNECT', //모니터링의 이상감지가 생겼을때 



	// visitor_check.js
	// 지오데이터 통해 엉뚱한곳(위치 몇km)에서, 지속성? && 300회이상 쿼리 발생하였을떄
	// oldkey 조회 related로 편입
	
	// highperformance.js
	// related 편입된 데이터 패턴분석후 합산
	// 어디까지 용인할것인지(양 vs 질)
	

	// realtime.js
	// 

//이제부터 패턴분석 범주

	// geo.js
	// 사용자 위치
	// 사용자가 움직이고 있는지 정체하고있는지
	// 움직이고 있다면 움직이는 패턴분석. 차선으로 가는지 걷는지(속도로 추정)
	// 

}
	

