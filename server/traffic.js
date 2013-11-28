var Traffic = {

/*
 * calculate localStorage total size
 * KB
 */ 
	getLocalsize = function(){
	var allStrings = '';
	for(var key in window.localStorage){
		if(window.localStorage.hasOwnProperty(key)){
			allStrings += window.localStorage[key];
		}
	}
	return allStrings ? 3 + ((allStrings.length*16)/(8*1024)) : 0;
}


/*
 * distinguish item is object
 * @param object
 *
 */

var list = {}

isObject = function(target){
		 if(typeof target == 'object' || typeof target == 'array'){ return true }
		 else { return false}
}

/*
 * listify enum object(inheriated object)
 * @param object
 * CAUTION : DO NOT USE THIS FUNCTION(call stack overflow err)
 *
 */
objectListify = function(object){
	if(typeof object == 'object' || typeof object == 'array'){
		for(var i in object){

			var isobject = isObject(object[i])
				if(isobject) { objectListify(object[i]) } 
				else { list[i] = object[i] }
		}
	}
}



/*
 * return number of localStorage total key-value pairs
 * KB(killobyte)
 */
	callocalStorage : function(){
	return JSON.stringify(localStorage).length
}

function listify(touchobj){

	var lists ={}

	if(typeof touchobj == 'object'){
   for(var i in touchobj){
		 if(i == 'target'){

			 for(var j in touchobj['target']){
				 if(typeof touchobj['target'][j] === 'function' || typeof touchobj['target'][j] === 'object') continue;
				 lists[j] = touchobj['target'][j]}
		  }
		 if(i == 'target') continue
		 lists[i] = touchobj[i]
	 }
	}
	return lists
}


}





lzw_encode : function(s) {
    var s = JSON.stringify(s);
    var dict = {}, data = (s + "").split(""), out = [],
        currChar, phrase = data[0], code = 256;

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






  }// Traffic
