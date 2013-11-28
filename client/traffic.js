

function trafficController(pageID, option, settings){ 

	// checkout session storage & localstorage
	// if ok
	// if there's remainings in the localstorage, get data
	// send message to client what option is
	// socket.emit({option : option, settings : settings});
	// socket.on('clientInfo', function().... })	

if(option == 'time'){

	var sec = settings;
	setInterval(ajax(), sec)
		if(disconnected){
			clearInterval(ajax())
		}
}

if(option == 'storage'){

	socket.on('full-storaged', data);
	socket.emit('got_storage_all')
}
}


function getClientinfo(){
// check identifier in localstorage or cookie
// if not
// make new identifier and save in locacalstorage and cookie
// if browser doesn't support localstorage, just add not supported and
// just send data as ip address
// identifier change when client session closed 
// check out is threre's key in localstorage if not 	
// @param check ip address
// check user-agent
// check geo data(current)
// check DB
// connect/ deconnect timestamp
//

}

// 스토리지 여부 체크
function isStorage(){
 if(('localStorage' in window) && window['localStorage'] !== null) { return true }
 else { return false }
}


function sendAll(){
	//check remaings in localStore
	//if yes, send all data to server
	//check all data is gone
	//make new key and save and send to server
  
	var newkey = make_gtcc(Controller.gtccnumber)
	localStorage.setItem('gt_cc', newkey);	
	var remain = checkRemaings()
		if(remain >0) socket.emit(remain)
		
}



function sessionClosed(){
	window.onbeforeunload = sendAll();
}



function isObject(target){
		 if(typeof target == 'object' || typeof target == 'array'){ return true }
		 else { return false}
}

	 list ={};

	 function objectCompress(object){
		 if(typeof object == 'object' || typeof object == 'array'){
			 for(var i in object){

				 var isobject = isObject(object[i])
					 if(isobject) { objectCompress(object[i]) } 
				   else { list[i] = object[i] }
       }
		 }
	 }


