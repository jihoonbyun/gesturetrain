
		
	// ���ڵ� �ڽ� :  ��� ��ġ�̺�Ʈ�� ���� ��ü
	// ����ó �ڽ� :  ��ġ�̺�Ʈ���� ����ó�� �з�����, �ʿ������� ���� ��ü
	// ���̵� �ڽ� :  ���ڵ� �ڽ��� ���� ��ġ�̺�Ʈ ��Ʈ
	// �� �ڽ� :  ����ó �ڽ��� ���� ��ü ��Ʈ


	// ��ġ �̺�Ʈ ������
	jQuery(window).on('touchstart',filter);
	jQuery(window).on('touchend',filter);
	jQuery(window).on('touchmove',filter );
 
	// ��� �̺�Ʈ �����
	var Recordbox = {}

	// ��� ����ó �����
	var Gesturebox = [];

	// ���ڵ�ڽ��� �� ��Ʈ�ڽ�
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
	 this.movingset =[] // ���� �����͸� x,y�� ���� �����ؼ� ����
 }


 // ���� �߻��� ���� �߻��� �̺�Ʈ ���̵� ����
 var movings = {};

 // ��Ÿ��� 
 function distance_two(pt, pt2) {

	var x2 = Math.pow((pt[0]-pt2[0]),2),
	    y2 = Math.pow((pt[1]-pt2[1]),2);

	return Math.sqrt((x2+y2));
}

// ���� ���ϱ�
function getAngle(P1, P2){

  var deltaY = P2.y - P1.y,
      deltaX = P2.x - P1.x,
      degree = Math.atan2(deltaY / deltaX) * 180 / Math.PI
	return degree;
}

// lzw ���ڵ� ���ڵ�(https://gist.github.com/revolunet/843889)
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



// ���Ⱒ�� ���ϱ�
	function getDirection(id){

		var g = Recordbox[id],
		    stat = g['stat'],
		    gm = g.move,
		    l = gm.length,
		    sc = g.start.pageX - g.end.pageX,
		    e = g.start.pageY - g.end.pageX,
		    direction = []

		// direction ����
		if(sc <0) { g.direction[0] = 'right'}
		if(sc =0) { g.direction[0] = 'same'}
		if(sc >0) { g.direction[0] ='left'}

		if(ec <0) { g.direction[1] = 'up' }
		if(ec =0) { g.direction[1] ='same' }
		if(ec >0) { g.direction[1] ='down' }	

}

// ��ġ���� ������������
  function isPinch(id){

	var set = movings[id],
	    leng = set.length;

	// ��ġ or �������� �϶�
	// �հ����� �ΰ� �÷����������� �Ǵ��Ѵ�
	if(set && leng = 2){

	var a = set[0],
	    b = set[1],
	    first_distance = distance_two(a.start, b.start),
	    last_distance = distance_two(a.end, b.end)

	(first_distance > last_distance) ? true : false
}
}







  // �̺�Ʈ ���͸�	
	function filter(e){
		if(e.type == 'touchstart'){ tos(e); }
		if(e.type == 'touchend'){ toe(e); }
		if(e.type == 'touchmove') { tom(e); }
	}

	// touchstart �ڵ鷯
	function tos(e){
		
		var touches = e.originalEvent.touches,
		    leng = touches.length;

		// ���̵�ڽ��� ���ʷ� �����Ѵ�
		var newid = new idbox();
		
		// ���̵� ���� �÷����ִ� ��ó �� ���� ���߿� ���� �����Ѵ�
		newid.id = touches[leng-1]['identifier'];
		
		// start�� �ش� �̺�Ʈ ��ü�� ���� �ִ´�.
		newid['start'] = touches[leng-1]
		
		// elapsed�� �ش� �̺�Ʈ ��ü�� ���� �ð��� ���� �ִ´�.
		newid['elapsed'] = touches[leng-1]['timeStamp'];

    // ���ڵ�ڽ��� �ش� ��ü ���̵���� Ű������, ���̵�ڽ��� ��ü�� �ִ´�		
		Recordbox[newid.id] = newid
	
	}


	// touchmove �ڵ鷯
	function tom(e){
		e.preventDefault()
		var mov = e.originalEvent.touches,
		    moves = [];
	  
	  // ���� �����̴� ��ġ�� ������ �ݺ��� ������	
		for(var i=0,mleng = mov.length;i<mleng;i++){

			// �����̴� ��ġ�� ���̵� ����
			var movid = mov[i]['identifier']

			// ���ڵ� �ڽ����� �����̴� ��ġ ���̵� ã�� move�� �̺�Ʈ ��ü �ֱ�
			Recordbox[movid]['move'].push(mov[i]);

			// �ѹ��� �����̴� �հ����� �ΰ� �̻��� ��
			if(mleng >1){

				// ���ڵ�ڽ��� �����̴� �հ��� ���̵� ã�Ƽ� ���ȿ� ��Ƽ �߰�
				Recordbox[movid]['stat'] = 'multi';
				
				// ���꽺�� �ش� ���̵� ����ֱ�
				moves.push(movid);
			}
		}
		// ���ν��� Ű�������ϰ�, ���ν����̵� ������ ����ֱ�
		movings[moves[0]] = moves;
	}


  // touchend �ڵ鷯	
	function toe(e){
		var end = e.originalEvent.changedTouches,
		    endid = end[0]['identifier'],
		    result = parseInt(e.timeStamp - Recordbox[endid]['elapsed']);

	  // ���ڵ�ڽ����� ���� ��ġ�� ���̵� ã�Ƽ� end�� �̺�Ʈ��ü �ֱ�	
		Recordbox[endid]['end'] = end[0];

		// elapsed�� �����ð����� ���� ����ð��� ����
		Recordbox[endid]['elapsed'] = result

		// �� ����ó �Լ� ����
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


		// ���ڵ� �ڽ��� ���̵�ڽ��� �����Ҷ�
		if(leng >0){

			// �ش� ���̵�ڽ��� ������ ��Ƽ�϶�
			// �� ��ũ���� �μ��̻��� �÷��� �־�����.

			if( stat == 'multi'){

				// ��ġ�̸� ��ġ�Լ� �߻�
				// ��������� ���������Լ� �߻�
				return ((isPinch(id)) ? 'pinch' : 'spread');
				
			} // ��Ƽ ��


			// �ش� ���̵�ڽ��� ������ �̱��ϋ�
			// �� ��ũ���� �Ѽո��� �÷��� �־�����
			if(stat == 'single'){

				// ���갡 �߻������� �巡�� �Լ� �߻�
				var mleng = moment['move'].length;
				(mleng > 0) ? 'drag' :

				// ��ŸƮ���� ������� 1�� �̻� ������
				// �����Լ� �߻�
				(moment['elapsed'] >= 1000) ? 'longtab' : 

				// elapsed Ÿ���� 1�� �������ٰ� x,y��ǥ�� 5�����̸� ������
				// �ƹ��͵� �ƴϸ� ��
				(before['elapsed'] < 1000 && chx <6 && chy<6) ? 'doubletab' : 'tab'

			} // �̱� ��
		}
	} // �˰��� ��



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

		// gbox �ν��Ͻ� ����
		var gb = new gbox(id);

		// ����ó ���� �˾Ƴ���
		gb.gesture = getGesuture(id)

		// ��ŸƮ Ÿ�� �˾Ƴ���
		gb.startime = rb.start.timeStamp

		// ���� Ÿ�� �˾Ƴ���
		gb.endtime = rb.end.timeStamp;

		// ��ŸƮ ����Ʈ
		gb.startpoint = p1

		// ���� ����Ʈ
		gb.endpoint = p2

		// ���� �˾Ƴ���
		gb.direction = getAngle(p1,p2);

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







