var Controller = new function(){

	// key.js
	this.gtcc_LENGTH = 50 // gtcc 키 생성시 자릿수
	this.gtcc_ENCODING = true // 키 압축 인코딩(lzw) 여부
	this.gtcc_STORAGE = 'localStorage';// 사용할 스토리지. 로컬스토리지 지원안하면 자동으로 쿠키저장
	this.gtcc_COOKIE_EXP = false // 쿠키 유효기간.(디폴트 : 설정안함)
	 
  // traffic.js
	// 클라이언트 저장소에 저장해두었다가 전송하는 방식 설정
	this.traffic_WAY = 'time' // 일정시간방식 vs 일정용량방식
	this.traffic_SETTIME =3000 // 시간일경우, 3초마다
	this.traffic_KB = 5 // 용량방식일경우, 5kb마다

	// monitoring.js
	// 클라이언트의 성능상태를 모니터링하는 방법 설정
	this.monitoring_WAY = 'both' // 로딩속도 vs js힙메모리
	this.monitoring_TIME_ARRAY =  ['fetchStart','responseEnd'] //네트워크 딜레이
  //this.monitoring_TIME_LOADING = ['loadEventEnd', 'responseEnd'] //페이지로딩 
  //this.monitoring_TIME_WHOLE = ['loadEventEnd', 'navigationStart'] //전체프로세스
	this.monitoring_TIME_LIMIT = 4000 
	this.monitoring_MEMORY_LIMIT= 50//메모리 리미트 퍼센테이지
}
	

