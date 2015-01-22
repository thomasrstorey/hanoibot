// /app/models/User.js

// schema =========================================

var mongoose 		= require('mongoose');
var bcrypt 			= require('bcrypt-nodejs');

var stateSchema = mongoose.Schema({
		timestamp	: Number,
		data		: String 
});

module.exports = mongoose.model('State', stateSchema);