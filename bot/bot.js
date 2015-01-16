var _ 			= require('underscore');
var Twit 		= require('twit');
var config		= require('./config.js');

//keep .log file with current game state
//every set interval, 
//	read state from log file, 
//	compute next move, 
//	write new state, 
//	format and send new tweet, 
//	set new interval

//the recursive algorithm should push all the moves to a stack.
//the set interval will then manipulate the arrays, and produce the output

module.export = function (rate, depth) {
	var that = {};
	var twit = new Twit(config);
	var moveNum = 0;
	var pegs = [[], [], []];

	var shift = function (N, d, pegs) {
		for (var i = 0; i != 3; ++i) {
			if(!(pegs[i].length === 0) && pegs[i][0] === N) {
				var disk = pegs[i].shift();
				if(d > 0){
					pegs[(i+1)%3].unshift(disk);
				} else if (d < 0) {
					pegs[(i+2)%3].unshift(disk);
				}
				makeTweet(pegs);
			}
		}
	};

	//takes a tower state and converts it to a string
	var convertState = function(pegs) {
		var msgArray = new Array(depth);
		for(var i = 0; i != 3; ++i) {
			for(var j = 0; j!= pegs[i].length; ++j){
				msgArray[pegs[i][j]] = i;
			}
		}
		var msg = "";
		for(var i = 0; i != msgArray.length; ++i){
			if(msgArray[i] === 0) {
				msg = msg + 'a';
			} else if (msgArray[i] === 1) {
				msg = msg + 'b';
			} else if (msgArray[i] === 2) {
				msg = msg + 'c';
			}
		}
		return msg;
	}

	//takes a tower state and tweets it
	var makeTweet = function (state) {
		var tweet = convertState(state);
		twit.post('statuses/update', { status: msg }, function(err, data, response) {
			if(err){
				console.log(err);
			} else {
				console.log('tweet: 'msg);
			}
		});
	};

	var makeMove = function (pegs) {
		
	}

	// start the bot
	var init = function () {
		//set initial condition;
		for(var i = depth; i != 0; --i) {
			pegs[0].unshift(i);
		}
		//start recursion
		(function moveTower(N, d, pegs, rate){
			var immediate = 500;
		   setTimeout(function(){
		    if(N === 0) { return; }
			moveTower(N-1, -d, pegs, immediate);
			shift(N, d, pegs);
			moveTower(N-1, -d, pegs);
		   }, rate);
		})(depth, -1, pegs, rate);

	};

	that.init = init;
	return that;
}

//ok, saving it all to a stack won't work because that defeats the purpose of recursion:
//massive time complexity in exchange for tiny space complexity.
//what I need is a way to recursively call a setTimeout, saving out my current state
//to pass to the callback (maybe that's what it already does? I just need an object
//to represent the state)