var _ 			= require('underscore');
var Twit 		= require('twit');
var config		= require('./config.js');

var twit = new Twit(config);

//keep .log file with current game state
//every set interval, 
//	read state from log file, 
//	compute next move, 
//	write new state, 
//	format and send new tweet, 
//	set new interval