// /app/routes.js

var fs = require('fs');

module.exports = function (app) {
	//main page
	app.get('/', function (req, res) {
    var lines = [];
    var docs = [];
    var path = __dirname.slice(0, -4);
    fs.createReadStream(path+"/bot/log.txt")
      .on('data', function(chunk) {
        var chunkString = chunk.toString();
        var chunkLines = chunkString.split("\n");
        chunkLines.forEach(function (v, i, arr) {
            lines.unshift(v);
            if(lines.length > 720) { 
                lines.pop(); 
            }
        });
        lines.shift();
      })
      .on('end', function () {
        
        lines.forEach(function (v, i, arr) {
            var line = v.split(",");
            var timestamp = line[0];
            var msg = line[1];
            docs.push({
                timestamp: timestamp,
                data: msg
            });
        });
        console.log(docs);
        var data = {
                docs : docs
            };
        res.render('index.hbs', data); 
      });
	});
}

// check login status
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}