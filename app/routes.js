// /app/routes.js

module.exports = function (app, passport) {

	//main page
	app.get('/', function (req, res) {
		res.render('index.hbs');
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