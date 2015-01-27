// server.js

// setup =======================================================
var express 				= require('express');
var app      				= express();
var http 					= require('http').Server(app);
var port     				= process.env.PORT || 8282;
var mongoose 				= require('mongoose');
var passport 				= require('passport');
var methodOverride			= require('method-override');
var cookieParser 			= require('cookie-parser');
var bodyParser  			= require('body-parser');
var session      			= require('express-session');
var hbs    					= require('hbs');
var io 						= require('socket.io')(http);

var configDB 				= require('./config/db.js');

var State = require('./app/models/State');
var Spans = require('./config/spans');

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

app.engine('hbs', require('hbs').__express); //handlebars engine
require('./app/handlebars.js')(hbs);

// socket.io ====================================================

var now = Date.now();
var retrievals = 1;
io.on('connection', function (socket) {
	console.log("a user connected");
	socket.on('disconnect', function () {
		console.log("a user disconnected")
	});
	socket.on('more', function () {
		console.log("request for more");
		retrievals++;
		console.log(now - Spans.oneDay*retrievals);
		console.log(now - Spans.oneDay*(retrievals-1));
		State.find({ timestamp : { $gte: now - Spans.oneDay*retrievals, $lte: now - Spans.oneDay*(retrievals-1) } }, function (err, docs){
			console.log("retrievals: " + retrievals);
			docs = _.sortBy(docs, function (doc) {
				return -doc.timestamp;
			});
			docs = _.toArray(docs);
			socket.emit('sentMore', docs);
		});
	});
});



// routes =======================================================

require('./app/routes.js')(app, passport, now); //load routes

// bot ==========================================================

require('./bot/towering.js')(io, mongoose);

// run ==========================================================

http.listen(port);
console.log("hanoijs launched on port " + port);