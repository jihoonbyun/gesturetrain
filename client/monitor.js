// require( Controller.js)
Monitoring = {

	init  : function(){
						this.timings = window.performance.timing
						this.memory = window.performance.memory || window.console.memory
						this.way = Controller.monitoring_WAY;
						this.timelimit = Controller.monitoring_TIME_LIMIT;
						this.memorylimit = Controller.monitoring_MEMORY_LIMIT;
						this.tarr = Controller.monitoring_TIME_ARRAY 

						this.support = this.isSupport();
						this.usedmemory = this.getMemory();
						this.memoryratio = this.getmemoryRatio();
						this.elapsedtime = this.getTimings();
						this.danger = this.isDanger();
					},


	isSupport : function(){
								if(this.timings && this.memory) return 3
								else if(this.timings && !this.memory) return 1
								else if(this.memory && !this.timings) return 2
								else return false 
							},

	getMemory : function(){
								return this.memory.usedJSHeapSize
							},

	getmemoryRatio : function(){
										 var ratio =0;
										 ratio = this.memory.totalJSHeapSize/this.memory.jsHeapSizeLimit
											 return ratio * 100
									 },
	getTimings : function(){
								 var first = '', last = '',elapsed = 0;
								 first = this.tarr[0],
											 last = this.tarr[1];

								 elapsed = Math.abs(this.timings[last] - this.timings[first])
									 return elapsed
							 },
	isDanger : function(){
							 if(this.way == 'time' && (this.support == 1||3)){
								 (this.elapsedtime >= this.timelimit) ? true : false 
							 }

							 if(this.way == 'memory' && (this.support == 2||3)){
								 (this.memoryratio >= this.memorylimit) ? true : false
							 }
							 if(this.way == 'both' && this.support >0){
								 if((this.elapsedtime >= this.timelimit) || (this.memoryratio >= this.memorylimit)) {return true}
								 else { return false}
							 }
							 else { return false}
						 }

}// Monitoring end
