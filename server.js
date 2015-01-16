// server.js

// setup =======================================================
var express 				= require('express');
var app      				= express();
var port     				= process.env.PORT || 8282;
var mongoose 				= require('mongoose');
var passport 				= require('passport');
var methodOverride			= require('method-override');
var cookieParser 			= require('cookie-parser');
var bodyParser  			= require('body-parser');
var session      			= require('express-session');
var hbs    					= require('hbs');

var configDB 				= require('./config/db.js');

// configuration ==============================================

mongoose.connect(configDB.url); //connect to db

app.use(cookieParser()); //use cookies for auth
app.use(bodyParser()); //parse html forms

// handle POST parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request
// simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');

// passport ====================================================

require('./config/passport')(passport); //config passport

app.use(session({ secret: 'tohisacyclicalrecursivestructure' }));
app.use(passport.initialize()); //start passport
app.use(passport.session()); //persistent login sessions

// handlebars ===================================================

//app.set('view engine', 'hbs');
app.engine('hbs', require('hbs').__express); //handlebars engine

// routes =======================================================

require('./app/routes.js')(app, passport); //load routes

// run ==========================================================

app.listen(port);
console.log("hanoijs launched on port " + port);