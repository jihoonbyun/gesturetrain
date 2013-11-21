// Ŭ���̾�Ʈ�� �ĺ��� �� �ִ� ���� Ű�� ����
// Ű�� �����ϰ� �ٽ� �������ϴ� ���
// ���ý��丮�� �����İ� ��Ű�������� ����
// include Controller, Utils

var Key = {

function init(){
	this.key_exist = isExist(); // true or false
	this.storage = isStorage(); // �����
	this.key = autoKey(); // Ű��(�������ϼ���, ���ο���ϼ���)
},

// ��Ű �Լ� ��Ʈ
function getCookie( cookieName ){
	var search = cookieName + "=";
	var cookie = document.cookie;
	if( cookie.length > 0 )
	{
		// �ش� ��Ű���� �����ϴ��� �˻��� �� �����ϸ� ��ġ�� ����.
		startIndex = cookie.indexOf( cookieName );
		// ���� �����Ѵٸ�
		if( startIndex != -1 )
		{
			// ���� ���� ���� ���� �ε��� ����
			startIndex += cookieName.length;
			// ���� ���� ���� ���� �ε��� ����
			endIndex = cookie.indexOf( ";", startIndex );
			// ���� ���� �ε����� ��ã�� �Ǹ� ��Ű ��ü���̷� ����
			if( endIndex == -1) endIndex = cookie.length;
			// ��Ű���� �����Ͽ� ����
			return unescape( cookie.substring( startIndex + 1, endIndex ) );
		}
		else
		{
			// ��Ű ���� �ش� ��Ű�� �������� ���� ���
			return false;
		}
	}
	else
	{
		// ��Ű ��ü�� ���� ���
		return false;
	}
},

/**
 * ��Ű ����
 * @param cookieName ��Ű��
 * @param cookieValue ��Ű��
 * @param expireDay ��Ű ��ȿ��¥
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
 * ��Ű ����
 * @param cookieName ������ ��Ű��
 */
function deleteCookie( cookieName ){
	var expireDate = new Date();

	//���� ��¥�� ��Ű �Ҹ� ��¥�� �����Ѵ�.
	expireDate.setDate( expireDate.getDate() - 1 );
	document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
},


// ���� ���̵�Ű ����
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

// ���ý��丮�� Ȥ�� ��Ű�� Ű�� �ִ��� Ȯ���Ѵ�
// Ű���ִٸ� �ش� ����Ҹ� �����ϰ� ������ false
function isKey(){
	
	var gtccs = window.localStorage.getItem('gtcc');
	var gtccc = this.getCookie('gtcc');
	if(gtccs) return gtccs 
	else if(gtccc) return gtccc
	else return false
},

// �Ҹ��Լ�
funtion isExist(){
	var gtccs = window.localStorage.getItem('gtcc');
	var gtccc = this.getCookie('gtcc');
  gtccs || gtccc ? true : false

},

function isLocal(){
	if(('localStorage' in window) && window['localStorage'] !== null) { return true }
	else { return false }
},



// ���� ���丮��
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
       else { alert('��Ʈ�ѷ� ��Ű exp ����. ����ڿ��� �����ϼ���') }		   
      }

			return wowkey
},

// Ű�� �ִ��� ������ üũ
// Ű�� ������ �ٷ� �����ؼ� ����
function autokey(){
	 var iskey = isKey();
	 var key ='';
		if(iskey == false){ key = newKey(); return key;} 
	  else { return isKey } 	
},

// Ű�� ����
function eraseKey(){
  var key = isKey();
	if(key =='localStorage'){
 	localStorage.removeItem('gtcc') }

	if(key == 'cookie'){
  deleteCookie('gtcc') } 
 
	else {return  false }
},
}
