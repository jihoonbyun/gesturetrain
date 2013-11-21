// 방문자의 정보 세트
// isMobile, getTime, isStorage 을 추가했다 2013.11.19
// http://www.quirksmode.org/js/detect.html
//
require('controller.js');
require('key.js');

var Visitor = {
	init: function () {
					this.device = isMobile()
					this.getTime();
					this.geodata =
					this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
					this.version = this.searchVersion(navigator.userAgent)
						|| this.searchVersion(navigator.appVersion)
						|| "an unknown version";
					this.OS = this.searchString(this.dataOS) || "an unknown OS";
				},

	// 모바일인지 여부 확인
	isMobile : function(){
							 var filter = "win16|win32|win64|mac";
							 if( navigator.platform  ){
								 if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
									 return 'mobile'
								 }else{
									 return 'pc'
								 }
							 }
						 },

	// 현재 시간 확인
	getTime() : function(){

		var now = new Date(),
		this.year = now.getFullYear(),
		this.month =(now.getMonth()+1),
		this.date  = now.getDate(), 
		this.hours = now.getHours(),
		this.minute = now.getMinutes(),
		this.second = now.getSeconds(),
		this.day = now.getDay();

		var result = {}
		result = {'year' : year, 'month' : month, 'date' : date, 'hours' : hours,
			'minute' : minute, 'second' : second, 'day' : day }
		return result
	},


	getGeodata : function(){



	},


	searchString: function (data) {
									for (var i=0;i<data.length;i++)	{
										var dataString = data[i].string;
										var dataProp = data[i].prop;
										this.versionSearchString = data[i].versionSearch || data[i].identity;
										if (dataString) {
											if (dataString.indexOf(data[i].subString) != -1)
												return data[i].identity;
										}
										else if (dataProp)
											return data[i].identity;
									}
								},

		searchVersion: function (dataString) {
										 var index = dataString.indexOf(this.versionSearchString);
										 if (index == -1) return;
										 return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
									 },

		dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
		dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone/iPod"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
visitor.init();

