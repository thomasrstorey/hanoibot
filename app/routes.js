// /app/routes.js

var State = require('./models/State');
var Spans = require('../config/spans');

module.exports = function (app, passport, now) {
	//main page
	app.get('/', function (req, res) {
        State.find({ timestamp: { $gte: now - Spans.oneDay }}, function (err, docs) {
            if(err){
                console.log(err);
                res.render('error.hbs', err);
            } else {
                var data = {
                    docs : docs
                }
                res.render('index.hbs', data); 
            }
        });
	});

	//login
	app.get('/auth/twitter', passport.authenticate('twitter'));

	//callback
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

	//logout
	app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
}

// check login status
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}