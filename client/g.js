
		
	// 리코드 박스 :  모든 터치이벤트를 담은 객체
	// 제스처 박스 :  테치이벤트들을 제스처로 분류한후, 필요정보를 담은 객체
	// 아이디 박스 :  레코드 박스에 들어가는 터치이벤트 셋트
	// 지 박스 :  제스처 박스에 들어가는 객체 세트


	// 터치 이벤트 리스너
	jQuery(window).on('touchstart',filter);
	jQuery(window).on('touchend',filter);
	jQuery(window).on('touchmove',filter );
 
	// 모든 이벤트 기록지
	var Recordbox = {}

	// 모든 제스처 기록지
	var Gesturebox = [];

	// 리코드박스에 들어갈 셋트박스
	var idbox = function(){
	 this.id= '';
	 this.elapsed = '';
	 this.stat = 'single';
	 this.start = [];
	 this.move = []; 
	 this.end = [];
	 this.direction = [];
 };

 var gbox = function(){
	 this.gesture = '';
	 this.id ='';
	 this.starttime = 0;
	 this.endtime =0;
	 this.startpoint =[];
	 this.endpoint =[];
	 this.direction =[];
	 this.movingset =[] // 무브 데이터를 x,y로 나눠 압축해서 저장
 }


 // 무브 발생시 같이 발생한 이벤트 아이디 묶음
 var movings = {};

 // 피타고라스 
 function distance_two(pt, pt2) {

	var x2 = Math.pow((pt[0]-pt2[0]),2),
	    y2 = Math.pow((pt[1]-pt2[1]),2);

	return Math.sqrt((x2+y2));
}

// 각도 구하기
function getAngle(P1, P2){

  var deltaY = P2.y - P1.y,
      deltaX = P2.x - P1.x,
      degree = Math.atan2(deltaY / deltaX) * 180 / Math.PI
	return degree;
}

// lzw 인코딩 디코딩(https://gist.github.com/revolunet/843889)
// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
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
}
 
// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
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
}



// 방향각도 구하기
	function getDirection(id){

		var g = Recordbox[id],
		    stat = g['stat'],
		    gm = g.move,
		    l = gm.length,
		    sc = g.start.pageX - g.end.pageX,
		    e = g.start.pageY - g.end.pageX,
		    direction = []

		// direction 결정
		if(sc <0) { g.direction[0] = 'right'}
		if(sc =0) { g.direction[0] = 'same'}
		if(sc >0) { g.direction[0] ='left'}

		if(ec <0) { g.direction[1] = 'up' }
		if(ec =0) { g.direction[1] ='same' }
		if(ec >0) { g.direction[1] ='down' }	

}

// 핀치인지 스프레드인지
  function isPinch(id){

	var set = movings[id],
	    leng = set.length;

	// 핀치 or 스프레드 일때
	// 손가락이 두개 올려져있을때만 판단한다
	if(set && leng = 2){

	var a = set[0],
	    b = set[1],
	    first_distance = distance_two(a.start, b.start),
	    last_distance = distance_two(a.end, b.end)

	(first_distance > last_distance) ? true : false
}
}







  // 이벤트 필터링	
	function filter(e){
		if(e.type == 'touchstart'){ tos(e); }
		if(e.type == 'touchend'){ toe(e); }
		if(e.type == 'touchmove') { tom(e); }
	}

	// touchstart 핸들러
	function tos(e){
		
		var touches = e.originalEvent.touches,
		    leng = touches.length;

		// 아이디박스를 최초로 생성한다
		var newid = new idbox();
		
		// 아이디를 현재 올려져있는 터처 중 가장 나중에 것을 선택한다
		newid.id = touches[leng-1]['identifier'];
		
		// start에 해당 이벤트 객체를 집어 넣는다.
		newid['start'] = touches[leng-1]
		
		// elapsed에 해당 이벤트 객체의 최초 시간을 집어 넣는다.
		newid['elapsed'] = touches[leng-1]['timeStamp'];

    // 리코드박스에 해당 객체 아이디명을 키값으로, 아이디박스를 객체로 넣는다		
		Recordbox[newid.id] = newid
	
	}


	// touchmove 핸들러
	function tom(e){
		e.preventDefault()
		var mov = e.originalEvent.touches,
		    moves = [];
	  
	  // 현재 움직이는 터치의 갯수를 반복문 돌린다	
		for(var i=0,mleng = mov.length;i<mleng;i++){

			// 움직이는 터치의 아이디 추출
			var movid = mov[i]['identifier']

			// 리코드 박스에서 움직이는 터치 아이디를 찾아 move에 이벤트 객체 넣기
			Recordbox[movid]['move'].push(mov[i]);

			// 한번에 움직이는 손가락이 두개 이상일 때
			if(mleng >1){

				// 리코드박스에 움직이는 손가락 아이디 찾아서 스탯에 멀티 추가
				Recordbox[movid]['stat'] = 'multi';
				
				// 무브스에 해당 아이디 집어넣기
				moves.push(movid);
			}
		}
		// 무부스를 키값으로하고, 무부스아이디 묶음을 집어넣기
		movings[moves[0]] = moves;
	}


  // touchend 핸들러	
	function toe(e){
		var end = e.originalEvent.changedTouches,
		    endid = end[0]['identifier'],
		    result = parseInt(e.timeStamp - Recordbox[endid]['elapsed']);

	  // 리코드박스에서 끝난 터치의 아이디 찾아서 end에 이벤트객체 넣기	
		Recordbox[endid]['end'] = end[0];

		// elapsed에 끝난시간에서 현재 현재시간을 뺀다
		Recordbox[endid]['elapsed'] = result

		// 겟 제스처 함수 실행
		getGesture(endid);
	}


	function getGesture(id){

		var moment = Recordbox[id],
		    stat = moment['stat'],
		    leng = Recordbox.length,
		    mx = moment['pageX'],
		    my = moment['pageY'];

		
		var id = parseInt(id),
		    before = Recordbox[id-1],
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
				return ((isPinch(id)) ? 'pinch' : 'spread');
				
			} // 멀티 끝


			// 해당 아이디박스의 스탯이 싱글일떄
			// 즉 스크린에 한손만이 올려져 있었을때
			if(stat == 'single'){

				// 무브가 발생했을때 드래그 함수 발생
				var mleng = moment['move'].length;
				(mleng > 0) ? 'drag' :

				// 스타트에서 엔드까지 1초 이상 지나면
				// 롱탭함수 발생
				(moment['elapsed'] >= 1000) ? 'longtab' : 

				// elapsed 타임이 1초 이전에다가 x,y좌표가 5이하이면 더블탭
				// 아무것도 아니면 탭
				(before['elapsed'] < 1000 && chx <6 && chy<6) ? 'doubletab' : 'tab'

			} // 싱글 끝
		}
	} // 알고리즘 끝



	// screen, page,client
	function gboxMaker(id, windows){

		var rb = Recordbox[id],
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
		var gb = new gbox(id);

		// 제스처 정보 알아내기
		gb.gesture = getGesuture(id)

		// 스타트 타임 알아내기
		gb.startime = rb.start.timeStamp

		// 엔드 타임 알아내기
		gb.endtime = rb.end.timeStamp;

		// 스타트 포인트
		gb.startpoint = p1

		// 엔드 포인트
		gb.endpoint = p2

		// 방향 알아내기
		gb.direction = getAngle(p1,p2);

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
 }

function getInfo(){
	var isMobile;
	if(!bd){ return 'error' } 
  (bd.isMobile()) ? isMobile = true : isMobiel = false
		var user_agent = 
  {'isMobile' : isMobile, 'browser' : bd.browser,
	 'version' : bd.version,
   'OS' :bd.OS } 
	return user_agent
}







