var _ 			= require('underscore');
var Twit 		= require('twit');
var config		= require('./cfg.js');
var TOH		= require('../build/Release/toh');
var State 		  = require('../app/models/State');

module.exports = function (rate, depth, io, mongoose) {
	var that = {};
	var twit;
	var toh;
	var moveNum;
	var vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
	var consonants = ['b', 'c', 'd', 'f', 'g', 'h',
					  'j', 'k', 'l', 'm', 'n', 'p',
					  'q', 'r', 's', 't', 'v', 'w',
					  'x', 'z'];

	
	//takes a tower state and tweets it
	var makeTweet = function (state) {
		var tweet = convertState(state);
		twit.post('statuses/update', { status: msg }, function(err, data, response) {
			if(err){
				console.log(err);
			} else {
				console.log('tweet: ' + msg);
			}
		});
	};

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

	var postToDB = function (str, ts, cb) {
		var newState = new State();
		newState.timestamp = ts;
		newState.data = str;
		newState.save(function(err){
			if(err){
				console.log(err.message);
				throw err;
			} else {
				return cb(null, {
					timestamp: ts,
					data: str
				});
			}
		});
	};

	// start the bot
	var init = function () {
		twit = new Twit(config.twitter);
		toh = new TOH.Tower(depth);
		moveNum = 0;
		// connect to mongoDB database
		//mongoose.connect(config.db.url);
		State.count({}, function(err, count){
			if(err){
				console.log(err);
			} else {
				(function towering(start){
					while(moveNum < count){
						toh.next();
						moveNum++;
					}
					setTimeout(function(){
						var msg = convertState(toh.next());
						if(config.test){
							makeTest(msg);
						} else {
							makeTweet(msg);
						}
						postToDB(msg, Date.now(), function(err, data){
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
			}
		});
	};

	that.init = init;
	return that;
}

String.prototype.replaceAt = function (c, index) { 
	return this.substr(0, index) + c + this.substr(index + 1);
}