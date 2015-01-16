// /config/passport.js

// initial setup ==============================================

var TwitterStrategy  = require('passport-twitter').Strategy;
// load up the user model
var User       = require('../app/models/User');
// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {
	//serialize user for session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	//deserialize user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	// twitter authentication =================================

	passport.use(new TwitterStrategy({
		consumerKey		: configAuth.twitterAuth.consumerKey,
		consumerSecret	: configAuth.twitterAuth.consumerSecret,
		callbackURL		: configAuth.twitterAuth.callbackURL
	},
	function(token, tokenSecret, profile, done) {
		//make code async
		//User.findOne won't fire until data comes back from Twitter

		process.nextTick(function() {
			User.findOne({ 'twitter.id' : profile.id }, function (err, user) {
				if(err){
					return done(err, null);
				}
				if(user) {
					return done(null, user);
				} else {
					var newUser 				= new User();
					newUser.twitter.id 			= profile.id;
					newUser.twitter.token 		= token;
					newUser.twitter.tokenSecret = tokenSecret;
					newUser.twitter.username	= profile.username;
					newUser.twitter.displayName = profile.displayName;

					newUser.save(function(err) {
						if(err){
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
		});
	}));
};