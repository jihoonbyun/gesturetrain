// Ŭ���̾�Ʈ ������ �κ�


	// ������ ����(������,���Ǿ��̵�,����,������,�������� ��)
	// ����/ �ܾƿ�
	// ��ũ�� ���ڷ� ��ġ �� ���� �ð� ����
	// ƿƮ ��ġ �ñ�
	// �����Է� ����

// ����� ���ӿ���
/*
if (navigator.userAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || navigator.userAgent.match(/LG|SAMSUNG|Samsung/) != null) {
  A;
}
else {
 B";
}
//�ٸ����

   var filter = "win16|win32|win64|mac";
 
    if( navigator.platform  ){
        if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
            alert("����� ��⿡�� ����");
        }else{
            alert("PC���� ����");
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


// Ŭ���̾�Ʈ ����
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

// ��ġ �̺�Ʈ ����
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
// �ȵ���̵�, ������ ���� �⺻ �����  ����ó 8 ��
//	var default = ['tab','double-tab','touch-hold','drag-flick','pinch','spread','swipe','etc']
// �߰� ����ó
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




  // �̺�Ʈ ������ ���
	//
	//
  // �ڵ鷯 Ŭ���� ��� ����
	var h = new Handler();

   // ��ũ���� �߻�������
	jQuery(window).on('scroll', h.scroll);

	// ���� �߻�������
	jQuery(window).on('resize', h.zoom);






