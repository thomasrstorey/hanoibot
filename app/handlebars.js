_ = require('underscore');

module.exports = function (hbs) {
	hbs.registerHelper('list', function (docs) {
		var out = "";
		var sorted = _.sortBy(docs, function (doc) { return -doc.timestamp; });
		_.map(sorted, function(doc){
			out += "<div class='row'><div class='one-third column'><div class='timestamp'>" + doc.timestamp + "</div></div><div class='two-third column'><pre>" + doc.data + "</pre></div></div>";
		});
		return out;
	});
}