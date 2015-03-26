var _ 			= require('underscore');
//var Twit 		= require('twit');
var config		= require('./cfg.js');
var TOH		= require('../build/Release/toh');
var State 		  = require('../app/models/State');
var fs = require('fs');

module.exports = function (rate, depth, io) {
	var that = {};
	//var twit;
	var toh;
	var moveNum;
	var vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
	var consonants = ['b', 'c', 'd', 'f', 'g', 'h',
					  'j', 'k', 'l', 'm', 'n', 'p',
					  'q', 'r', 's', 't', 'v', 'w',
					  'x', 'z'];

	var makeTest = function (state) {
		console.log(state);
	};

	var randomElement = function (arr) {
		return arr[Math.floor(Math.random()*arr.length)];
	};

	//converts raw state into tweet
	var convertState = function (state) {
		for(var i = 0; i != state.length; ++i) {
			if(state[i] == 'a') {
				state = state.replaceAt(randomElement(vowels), i);
			} else if (state[i] == 'b'){
				state = state.replaceAt(randomElement(consonants), i);
			} else if (state[i] == 'c'){
				state = state.replaceAt(' ', i);
			}
		}
		return state;
	};

	var writeToFile = function (ts, str, cb) {
		fs.appendFile(__dirname+"/log.txt", ts + "," + str + "\n", function (err) {
			return cb(err, {
				timestamp: ts,
				data: str
			});
		});
	}

	// start the bot
	var init = function () {
		//twit = new Twit(config.twitter);
		toh = new TOH.Tower(depth);
		moveNum = 0;

		var count = 0;
		fs.createReadStream(__dirname+"/log.txt")
		  .on('data', function(chunk) {
		    for (var i = 0; i != chunk.length; ++i)
		      if (chunk[i] == 10) count++;
		  })
		  .on('end', function() {
		    (function towering(start){
				while(moveNum < count){
					toh.next();
					moveNum++;
				}
				setTimeout(function(){
					var msg = convertState(toh.next());
				    writeToFile(Date.now(), msg, function (err, data) {
				    	if(err){
				    		console.log(err);
				    	} else {
				    		io.emit('move', data);
				    	}
				    });
					moveNum++;
					towering();
				}, rate);
			})();
		  });
	};

	that.init = init;
	return that;
}

String.prototype.replaceAt = function (c, index) { 
	return this.substr(0, index) + c + this.substr(index + 1);
}